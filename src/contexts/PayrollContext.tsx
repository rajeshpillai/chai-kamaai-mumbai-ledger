
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useEmployeeContext } from './EmployeeContext';
import { useAttendanceContext } from './AttendanceContext';

export interface PayrollRecord {
  id: number;
  employeeId: number;
  month: string;
  year: number;
  basicSalary: number;
  overtimeHours: number;
  overtimePay: number;
  bonuses: number;
  deductions: {
    pf: number;
    esi: number;
    tds: number;
    lateDeduction: number;
    absentDeduction: number;
  };
  grossSalary: number;
  netSalary: number;
  status: 'Draft' | 'Processed' | 'Paid';
  processedDate?: string;
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

    const basicSalary = employee.salary;
    const dailySalary = basicSalary / workingDays;
    
    // Calculate deductions
    const pf = Math.round(basicSalary * 0.12); // 12% PF
    const esi = Math.round(basicSalary * 0.0175); // 1.75% ESI
    const tds = basicSalary > 50000 ? Math.round(basicSalary * 0.1) : 0; // 10% TDS if salary > 50k
    const lateDeduction = Math.round(lateDays * (dailySalary * 0.1)); // 10% of daily salary per late day
    const absentDeduction = Math.round(absentDays * dailySalary);

    const totalDeductions = pf + esi + tds + lateDeduction + absentDeduction;
    const grossSalary = basicSalary;
    const netSalary = grossSalary - totalDeductions;

    return {
      id: Date.now(),
      employeeId,
      month,
      year,
      basicSalary,
      overtimeHours: 0,
      overtimePay: 0,
      bonuses: 0,
      deductions: { pf, esi, tds, lateDeduction, absentDeduction },
      grossSalary,
      netSalary,
      status: 'Draft'
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
