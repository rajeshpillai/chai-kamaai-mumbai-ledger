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

export const PayrollProvider = ({ children }: { children: ReactNode }) => {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const { employees } = useEmployeeContext();
  const { attendanceRecords } = useAttendanceContext();
  const { getEmployeeShift } = useShiftContext();
  const { getApprovedLeaveForMonth, isOnLeave } = useLeaveContext();

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
    
    // Leave calculations
    const approvedLeaves = getApprovedLeaveForMonth(employeeId, parseInt(month), year);
    const totalLeaveDays = approvedLeaves.reduce((sum, leave) => sum + leave.days, 0);
    const paidLeaveDays = approvedLeaves.filter(leave => leave.isPaid).reduce((sum, leave) => sum + leave.days, 0);
    const unpaidLeaveDays = totalLeaveDays - paidLeaveDays;
    
    const absentDays = workingDays - presentDays - totalLeaveDays;

    const salaryStructure = employee.salaryStructure;
    const grossSalary = calculateGrossSalary(salaryStructure);
    const dailySalary = grossSalary / workingDays;
    const hourlyRate = dailySalary / 8; // 8 hours per day
    
    // Calculate overtime
    const overtimeCalculation = calculateMonthlyOvertime(
      employeeId, 
      parseInt(month), 
      year, 
      attendanceRecords, 
      hourlyRate
    );
    
    // Calculate shift differentials
    let nightDifferential = 0;
    let shiftDifferential = 0;
    
    monthAttendance.forEach(record => {
      if (record.shiftId) {
        const shiftData = getEmployeeShift(employeeId, record.date);
        if (shiftData?.shift.nightDifferential) {
          nightDifferential += (record.regularHours + record.overtimeHours) * hourlyRate * (shiftData.shift.nightDifferential / 100);
        }
      }
    });
    
    // Leave deductions and encashments
    const unpaidLeaveDeduction = Math.round(unpaidLeaveDays * dailySalary);
    const leaveEncashment = 0; // Would calculate based on unused leaves and policy
    
    // Calculate Indian statutory deductions
    const pf = calculatePF(salaryStructure);
    const esi = calculateESI(salaryStructure).employee;
    const professionalTax = calculateProfessionalTax(employee.state, grossSalary);
    const tds = calculateTDS(salaryStructure.ctc); // Annual CTC for TDS calculation
    const lateDeduction = Math.round(lateDays * (dailySalary * 0.1)); // 10% of daily salary per late day
    const absentDeduction = Math.round(absentDays * dailySalary);

    const deductions = { 
      pf, 
      esi, 
      professionalTax, 
      tds, 
      lateDeduction, 
      absentDeduction,
      unpaidLeaveDeduction
    };
    
    // Calculate final salary with overtime and leave adjustments
    const adjustedGrossSalary = grossSalary + overtimeCalculation.totalOvertimePay + nightDifferential + shiftDifferential + leaveEncashment;
    const netSalary = adjustedGrossSalary - Object.values(deductions).reduce((sum, val) => sum + val, 0);

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
      overtimeHours: overtimeCalculation.totalOvertimeHours,
      overtimePay: overtimeCalculation.totalOvertimePay,
      nightDifferential: Math.round(nightDifferential),
      shiftDifferential: Math.round(shiftDifferential),
      bonuses: 0,
      leaveDetails: {
        totalLeaveDays,
        paidLeaveDays,
        unpaidLeaveDays,
        leaveDeduction: unpaidLeaveDeduction,
        leaveEncashment
      },
      deductions,
      grossSalary: Math.round(adjustedGrossSalary),
      netSalary: Math.round(netSalary),
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
