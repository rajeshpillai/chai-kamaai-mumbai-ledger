
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useEmployeeContext } from './EmployeeContext';
import { useAttendanceContext } from './AttendanceContext';
import { useShiftContext } from './ShiftContext';
import { useLeaveContext } from './LeaveContext';
import { 
  calculatePF, 
  calculateESI, 
  calculateProfessionalTax, 
  calculateTDS, 
  calculateGrossSalary,
  calculateNetSalary
} from '@/utils/indianPayrollCalculations';
import { calculateMonthlyOvertime } from '@/utils/overtimeCalculations';

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
  nightDifferential: number;
  shiftDifferential: number;
  bonuses: number;
  leaveDetails: {
    totalLeaveDays: number;
    paidLeaveDays: number;
    unpaidLeaveDays: number;
    leaveDeduction: number;
    leaveEncashment: number;
  };
  deductions: {
    pf: number;
    esi: number;
    professionalTax: number;
    tds: number;
    lateDeduction: number;
    absentDeduction: number;
    unpaidLeaveDeduction: number;
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

// Helper function to ensure valid number
const safeNumber = (value: any): number => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

// Helper function to validate salary structure
const validateSalaryStructure = (salaryStructure: any) => {
  if (!salaryStructure) return false;
  
  const requiredFields = ['basic', 'hra', 'da', 'specialAllowance', 'medicalAllowance', 'conveyanceAllowance', 'otherAllowances', 'ctc'];
  return requiredFields.every(field => typeof salaryStructure[field] === 'number' && !isNaN(salaryStructure[field]));
};

export const PayrollProvider = ({ children }: { children: ReactNode }) => {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const { employees } = useEmployeeContext();
  const { attendanceRecords } = useAttendanceContext();
  const { getEmployeeShift } = useShiftContext();
  const { getApprovedLeaveForMonth } = useLeaveContext();

  const calculatePayroll = (employeeId: number, month: string, year: number): PayrollRecord => {
    console.log(`Calculating payroll for employee ${employeeId}, month ${month}, year ${year}`);
    
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) {
      console.error('Employee not found:', employeeId);
      throw new Error('Employee not found');
    }

    // Validate salary structure
    if (!validateSalaryStructure(employee.salaryStructure)) {
      console.error('Invalid salary structure for employee:', employeeId, employee.salaryStructure);
      throw new Error('Invalid salary structure');
    }

    console.log('Employee salary structure:', employee.salaryStructure);

    // Get attendance records for the month
    const monthAttendance = attendanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === parseInt(month) - 1 && recordDate.getFullYear() === year && record.employeeId === employeeId;
    });

    console.log('Month attendance records:', monthAttendance.length);

    const workingDays = 26; // Standard working days per month
    const presentDays = monthAttendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
    const lateDays = monthAttendance.filter(a => a.status === 'Late').length;
    
    // Leave calculations with safe fallbacks
    let approvedLeaves = [];
    try {
      approvedLeaves = getApprovedLeaveForMonth ? getApprovedLeaveForMonth(employeeId, parseInt(month), year) : [];
    } catch (error) {
      console.warn('Error getting approved leaves, using empty array:', error);
      approvedLeaves = [];
    }

    const totalLeaveDays = safeNumber(approvedLeaves.reduce((sum, leave) => sum + safeNumber(leave.days), 0));
    const paidLeaveDays = safeNumber(approvedLeaves.filter(leave => leave.isPaid).reduce((sum, leave) => sum + safeNumber(leave.days), 0));
    const unpaidLeaveDays = safeNumber(totalLeaveDays - paidLeaveDays);
    
    const absentDays = Math.max(0, workingDays - presentDays - totalLeaveDays);

    const salaryStructure = employee.salaryStructure;
    
    // Calculate gross salary with validation
    const grossSalary = safeNumber(calculateGrossSalary(salaryStructure));
    console.log('Calculated gross salary:', grossSalary);
    
    if (grossSalary <= 0) {
      console.error('Invalid gross salary calculated:', grossSalary);
    }

    const dailySalary = safeNumber(grossSalary / workingDays);
    const hourlyRate = safeNumber(dailySalary / 8); // 8 hours per day
    
    console.log('Daily salary:', dailySalary, 'Hourly rate:', hourlyRate);
    
    // Calculate overtime with safe fallbacks
    let overtimeCalculation = { totalOvertimeHours: 0, totalOvertimePay: 0 };
    try {
      if (hourlyRate > 0) {
        overtimeCalculation = calculateMonthlyOvertime(
          employeeId, 
          parseInt(month), 
          year, 
          attendanceRecords, 
          hourlyRate
        );
      }
    } catch (error) {
      console.warn('Error calculating overtime, using defaults:', error);
    }

    console.log('Overtime calculation:', overtimeCalculation);
    
    // Calculate shift differentials with safe fallbacks
    let nightDifferential = 0;
    let shiftDifferential = 0;
    
    monthAttendance.forEach(record => {
      if (record.shiftId && getEmployeeShift) {
        try {
          const shiftData = getEmployeeShift(employeeId, record.date);
          if (shiftData?.shift.nightDifferential) {
            const recordHours = safeNumber(record.regularHours) + safeNumber(record.overtimeHours);
            nightDifferential += safeNumber(recordHours * hourlyRate * (safeNumber(shiftData.shift.nightDifferential) / 100));
          }
        } catch (error) {
          console.warn('Error calculating shift differential:', error);
        }
      }
    });
    
    // Leave deductions and encashments
    const unpaidLeaveDeduction = safeNumber(unpaidLeaveDays * dailySalary);
    const leaveEncashment = 0; // Would calculate based on unused leaves and policy
    
    // Calculate Indian statutory deductions with safe fallbacks
    let pf = 0, esi = 0, professionalTax = 0, tds = 0;
    
    try {
      pf = safeNumber(calculatePF(salaryStructure));
      esi = safeNumber(calculateESI(salaryStructure).employee);
      professionalTax = safeNumber(calculateProfessionalTax(employee.state || 'Maharashtra', grossSalary));
      tds = safeNumber(calculateTDS(safeNumber(salaryStructure.ctc)));
    } catch (error) {
      console.warn('Error calculating statutory deductions:', error);
    }

    const lateDeduction = safeNumber(lateDays * (dailySalary * 0.1)); // 10% of daily salary per late day
    const absentDeduction = safeNumber(absentDays * dailySalary);

    const deductions = { 
      pf: safeNumber(pf), 
      esi: safeNumber(esi), 
      professionalTax: safeNumber(professionalTax), 
      tds: safeNumber(tds), 
      lateDeduction: safeNumber(lateDeduction), 
      absentDeduction: safeNumber(absentDeduction),
      unpaidLeaveDeduction: safeNumber(unpaidLeaveDeduction)
    };
    
    console.log('Calculated deductions:', deductions);
    
    // Calculate final salary with overtime and leave adjustments
    const adjustedGrossSalary = safeNumber(
      grossSalary + 
      safeNumber(overtimeCalculation.totalOvertimePay) + 
      safeNumber(nightDifferential) + 
      safeNumber(shiftDifferential) + 
      safeNumber(leaveEncashment)
    );
    
    const totalDeductions = safeNumber(Object.values(deductions).reduce((sum, val) => sum + safeNumber(val), 0));
    const netSalary = safeNumber(adjustedGrossSalary - totalDeductions);

    console.log('Final calculations - Adjusted Gross:', adjustedGrossSalary, 'Total Deductions:', totalDeductions, 'Net Salary:', netSalary);

    return {
      id: Date.now(),
      employeeId,
      month,
      year,
      salaryBreakdown: {
        basic: safeNumber(salaryStructure.basic),
        hra: safeNumber(salaryStructure.hra),
        da: safeNumber(salaryStructure.da),
        specialAllowance: safeNumber(salaryStructure.specialAllowance),
        medicalAllowance: safeNumber(salaryStructure.medicalAllowance),
        conveyanceAllowance: safeNumber(salaryStructure.conveyanceAllowance),
        otherAllowances: safeNumber(salaryStructure.otherAllowances)
      },
      overtimeHours: safeNumber(overtimeCalculation.totalOvertimeHours),
      overtimePay: safeNumber(overtimeCalculation.totalOvertimePay),
      nightDifferential: Math.round(safeNumber(nightDifferential)),
      shiftDifferential: Math.round(safeNumber(shiftDifferential)),
      bonuses: 0,
      leaveDetails: {
        totalLeaveDays: safeNumber(totalLeaveDays),
        paidLeaveDays: safeNumber(paidLeaveDays),
        unpaidLeaveDays: safeNumber(unpaidLeaveDays),
        leaveDeduction: safeNumber(unpaidLeaveDeduction),
        leaveEncashment: safeNumber(leaveEncashment)
      },
      deductions,
      grossSalary: Math.round(safeNumber(adjustedGrossSalary)),
      netSalary: Math.round(safeNumber(netSalary)),
      status: 'Draft',
      basicSalary: safeNumber(salaryStructure.basic) // For backward compatibility
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
