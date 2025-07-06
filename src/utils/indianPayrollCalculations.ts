
import { SalaryStructure } from '@/contexts/EmployeeContext';

export interface TaxSlab {
  min: number;
  max: number;
  rate: number;
}

export const TAX_SLABS_2024: TaxSlab[] = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300000, max: 600000, rate: 0.05 },
  { min: 600000, max: 900000, rate: 0.10 },
  { min: 900000, max: 1200000, rate: 0.15 },
  { min: 1200000, max: 1500000, rate: 0.20 },
  { min: 1500000, max: Infinity, rate: 0.30 }
];

export const PROFESSIONAL_TAX_RATES: { [state: string]: number } = {
  'Maharashtra': 200,
  'Karnataka': 200,
  'West Bengal': 110,
  'Tamil Nadu': 100,
  'Andhra Pradesh': 150,
  'Telangana': 150,
  'Gujarat': 150,
  'Madhya Pradesh': 60,
  'Default': 200
};

export const calculatePF = (salaryStructure: SalaryStructure): number => {
  // PF is calculated on Basic + DA only, capped at ₹15,000
  const pfEligibleSalary = Math.min((salaryStructure.basic + salaryStructure.da), 15000);
  return Math.round(pfEligibleSalary * 0.12);
};

export const calculateESI = (salaryStructure: SalaryStructure): { employee: number; employer: number } => {
  const grossSalary = salaryStructure.basic + salaryStructure.hra + salaryStructure.da + 
                     salaryStructure.specialAllowance + salaryStructure.medicalAllowance + 
                     salaryStructure.conveyanceAllowance + salaryStructure.otherAllowances;
  
  // ESI is applicable only if gross salary is ≤ ₹21,000
  if (grossSalary > 21000) {
    return { employee: 0, employer: 0 };
  }
  
  const employeeESI = Math.round(grossSalary * 0.0075); // 0.75%
  const employerESI = Math.round(grossSalary * 0.0325); // 3.25%
  
  return { employee: employeeESI, employer: employerESI };
};

export const calculateProfessionalTax = (state: string, grossSalary: number): number => {
  const rate = PROFESSIONAL_TAX_RATES[state] || PROFESSIONAL_TAX_RATES['Default'];
  return grossSalary > 15000 ? rate : 0;
};

export const calculateTDS = (annualIncome: number, investments?: number): number => {
  const taxableIncome = annualIncome - (investments || 0);
  let tax = 0;
  
  for (const slab of TAX_SLABS_2024) {
    if (taxableIncome > slab.min) {
      const taxableAmount = Math.min(taxableIncome, slab.max) - slab.min;
      tax += taxableAmount * slab.rate;
    }
  }
  
  // Add 4% Health and Education Cess
  tax = tax * 1.04;
  
  return Math.round(tax / 12); // Monthly TDS
};

export const calculateGrossSalary = (salaryStructure: SalaryStructure): number => {
  return salaryStructure.basic + salaryStructure.hra + salaryStructure.da + 
         salaryStructure.specialAllowance + salaryStructure.medicalAllowance + 
         salaryStructure.conveyanceAllowance + salaryStructure.otherAllowances;
};

export const calculateNetSalary = (
  salaryStructure: SalaryStructure, 
  deductions: {
    pf: number;
    esi: number;
    professionalTax: number;
    tds: number;
    lateDeduction: number;
    absentDeduction: number;
  }
): number => {
  const grossSalary = calculateGrossSalary(salaryStructure);
  const totalDeductions = Object.values(deductions).reduce((sum, val) => sum + val, 0);
  return grossSalary - totalDeductions;
};
