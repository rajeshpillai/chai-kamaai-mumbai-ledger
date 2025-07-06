import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useEmployeeContext } from './EmployeeContext';
import { useAttendanceContext } from './AttendanceContext';
import { 
  calculatePF, 
  calculateESI, 
  calculateProfessionalTax, 
  calculateTDS, 
  calculateGrossSalary,
  calculateNetSalary
} from '@/utils/indianPayrollCalculations';

export interface PayrollRecord {
  id: number;
  employeeId: number;
  month: string;
  year: number;
  salaryBreakdown: {
    basic: number;
    hra: number;
    da: number;
    specialAllowance: number;
    medicalAllowance: number;
    conveyanceAllowance: number;
    otherAllowances: number;
  };
  overtimeHours: number;
  overtimePay: number;
  bonuses: number;
  deductions: {
    pf: number;
    esi: number;
    professionalTax: number;
    tds: number;
    lateDeduction: number;
    absentDeduction: number;
  };
  grossSalary: number;
  netSalary: number;
  status: 'Draft' | 'Processed' | 'Paid';
  processedDate?: string;
  // Keep for backward compatibility
  basicSalary: number;
}

interface PayrollContextType {
  payrollRecords: PayrollRecord[];
  calculatePayroll: (employeeId: number, month: string, year: number) => PayrollRecord;
  processPayroll: (month: string, year: number) => void;
  getPayrollByEmployee: (employeeId: number) => PayrollRecord[];
  getCurrentMonthPayroll: () => PayrollRecord[];
}

const PayrollContext = createContext<PayrollContextType | undefined>(undefined);

export const PayrollProvider = ({ children }: { children: ReactNode }) => {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const { employees } = useEmployeeContext();
  const { attendanceRecords } = useAttendanceContext();

  const calculatePayroll = (employeeId: number, month: string, year: number): PayrollRecord => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) throw new Error('Employee not found');

    // Get attendance records for the month
    const monthAttendance = attendanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === parseInt(month) - 1 && recordDate.getFullYear() === year && record.employeeId === employeeId;
    });

    const workingDays = 26; // Standard working days per month
    const presentDays = monthAttendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
    const lateDays = monthAttendance.filter(a => a.status === 'Late').length;
    const absentDays = workingDays - presentDays;

    const salaryStructure = employee.salaryStructure;
    const grossSalary = calculateGrossSalary(salaryStructure);
    const dailySalary = grossSalary / workingDays;
    
    // Calculate Indian statutory deductions
    const pf = calculatePF(salaryStructure);
    const esi = calculateESI(salaryStructure).employee;
    const professionalTax = calculateProfessionalTax(employee.state, grossSalary);
    const tds = calculateTDS(salaryStructure.ctc); // Annual CTC for TDS calculation
    const lateDeduction = Math.round(lateDays * (dailySalary * 0.1)); // 10% of daily salary per late day
    const absentDeduction = Math.round(absentDays * dailySalary);

    const deductions = { pf, esi, professionalTax, tds, lateDeduction, absentDeduction };
    const netSalary = calculateNetSalary(salaryStructure, deductions);

    return {
      id: Date.now(),
      employeeId,
      month,
      year,
      salaryBreakdown: {
        basic: salaryStructure.basic,
        hra: salaryStructure.hra,
        da: salaryStructure.da,
        specialAllowance: salaryStructure.specialAllowance,
        medicalAllowance: salaryStructure.medicalAllowance,
        conveyanceAllowance: salaryStructure.conveyanceAllowance,
        otherAllowances: salaryStructure.otherAllowances
      },
      overtimeHours: 0,
      overtimePay: 0,
      bonuses: 0,
      deductions,
      grossSalary,
      netSalary,
      status: 'Draft',
      basicSalary: salaryStructure.basic // For backward compatibility
    };
  };

  const processPayroll = (month: string, year: number) => {
    const newPayrollRecords = employees.map(employee => {
      const existing = payrollRecords.find(p => 
        p.employeeId === employee.id && p.month === month && p.year === year
      );
      
      if (existing) {
        return { ...existing, status: 'Processed' as const, processedDate: new Date().toISOString().split('T')[0] };
      }
      
      const calculated = calculatePayroll(employee.id, month, year);
      return { ...calculated, status: 'Processed' as const, processedDate: new Date().toISOString().split('T')[0] };
    });

    setPayrollRecords(prev => {
      const filtered = prev.filter(p => !(p.month === month && p.year === year));
      return [...filtered, ...newPayrollRecords];
    });
  };

  const getPayrollByEmployee = (employeeId: number) => {
    return payrollRecords.filter(record => record.employeeId === employeeId);
  };

  const getCurrentMonthPayroll = () => {
    const currentMonth = (new Date().getMonth() + 1).toString();
    const currentYear = new Date().getFullYear();
    return payrollRecords.filter(record => record.month === currentMonth && record.year === currentYear);
  };

  return (
    <PayrollContext.Provider value={{
      payrollRecords,
      calculatePayroll,
      processPayroll,
      getPayrollByEmployee,
      getCurrentMonthPayroll
    }}>
      {children}
    </PayrollContext.Provider>
  );
};

export const usePayrollContext = () => {
  const context = useContext(PayrollContext);
  if (!context) {
    throw new Error('usePayrollContext must be used within a PayrollProvider');
  }
  return context;
};
