
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface AttendanceRecord {
  id: number;
  employeeId: number;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day' | 'On Leave';
  location: string;
  notes?: string;
  // Enhanced fields for overtime and shift tracking
  shiftId?: number;
  regularHours: number;
  overtimeHours: number;
  breakTime: number; // in minutes
  totalWorkingHours: number;
}

interface AttendanceContextType {
  attendanceRecords: AttendanceRecord[];
  markAttendance: (employeeId: number, type: 'checkin' | 'checkout', location: string, shiftId?: number) => void;
  getAttendanceByDate: (date: string) => AttendanceRecord[];
  getEmployeeAttendance: (employeeId: number) => AttendanceRecord[];
  getTodayAttendance: () => AttendanceRecord[];
  calculateWorkingHours: (checkIn: string, checkOut: string, breakTime?: number) => { regular: number; overtime: number; total: number };
  updateAttendanceRecord: (id: number, updates: Partial<AttendanceRecord>) => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

const initialRecords: AttendanceRecord[] = [
  {
    id: 1,
    employeeId: 1,
    date: '2025-01-06',
    checkIn: '09:00',
    checkOut: '18:00',
    status: 'Present',
    location: 'Bandra West',
    shiftId: 1,
    regularHours: 8,
    overtimeHours: 1,
    breakTime: 60,
    totalWorkingHours: 9
  },
  {
    id: 2,
    employeeId: 2,
    date: '2025-01-06',
    checkIn: '09:15',
    checkOut: '18:30',
    status: 'Late',
    location: 'Andheri East',
    shiftId: 1,
    regularHours: 8,
    overtimeHours: 0.75,
    breakTime: 45,
    totalWorkingHours: 8.75
  },
  {
    id: 3,
    employeeId: 3,
    date: '2025-01-06',
    checkIn: '09:00',
    checkOut: null,
    status: 'Present',
    location: 'Powai',
    shiftId: 1,
    regularHours: 0,
    overtimeHours: 0,
    breakTime: 0,
    totalWorkingHours: 0
  }
];

export const AttendanceProvider = ({ children }: { children: ReactNode }) => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initialRecords);

  const calculateWorkingHours = (checkIn: string, checkOut: string, breakTime: number = 60) => {
    const checkInTime = new Date(`2000-01-01 ${checkIn}`);
    const checkOutTime = new Date(`2000-01-01 ${checkOut}`);
    
    // Handle overnight shifts
    if (checkOutTime < checkInTime) {
      checkOutTime.setDate(checkOutTime.getDate() + 1);
    }
    
    const totalMinutes = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60);
    const workingMinutes = totalMinutes - breakTime;
    const totalHours = workingMinutes / 60;
    
    const standardHours = 8; // Standard working hours
    const regularHours = Math.min(totalHours, standardHours);
    const overtimeHours = Math.max(0, totalHours - standardHours);
    
    return {
      regular: Number(regularHours.toFixed(2)),
      overtime: Number(overtimeHours.toFixed(2)),
      total: Number(totalHours.toFixed(2))
    };
  };

  const markAttendance = (employeeId: number, type: 'checkin' | 'checkout', location: string, shiftId?: number) => {
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    setAttendanceRecords(prev => {
      const existingRecord = prev.find(r => r.employeeId === employeeId && r.date === today);
      
      if (existingRecord) {
        return prev.map(record => {
          if (record.id === existingRecord.id) {
            if (type === 'checkout' && record.checkIn) {
              const workingHours = calculateWorkingHours(record.checkIn, currentTime, record.breakTime);
              return { 
                ...record, 
                checkOut: currentTime,
                regularHours: workingHours.regular,
                overtimeHours: workingHours.overtime,
                totalWorkingHours: workingHours.total
              };
            }
            return record;
          }
          return record;
        });
      } else if (type === 'checkin') {
        const newId = Math.max(...prev.map(r => r.id)) + 1;
        const isLate = currentTime > '09:00';
        
        return [...prev, {
          id: newId,
          employeeId,
          date: today,
          checkIn: currentTime,
          checkOut: null,
          status: isLate ? 'Late' : 'Present',
          location,
          shiftId,
          regularHours: 0,
          overtimeHours: 0,
          breakTime: 60, // Default 1 hour break
          totalWorkingHours: 0
        }];
      }
      
      return prev;
    });
  };

  const updateAttendanceRecord = (id: number, updates: Partial<AttendanceRecord>) => {
    setAttendanceRecords(prev => prev.map(record => 
      record.id === id ? { ...record, ...updates } : record
    ));
  };

  const getAttendanceByDate = (date: string) => {
    return attendanceRecords.filter(record => record.date === date);
  };

  const getEmployeeAttendance = (employeeId: number) => {
    return attendanceRecords.filter(record => record.employeeId === employeeId);
  };

  const getTodayAttendance = () => {
    const today = new Date().toISOString().split('T')[0];
    return getAttendanceByDate(today);
  };

  return (
    <AttendanceContext.Provider value={{
      attendanceRecords,
      markAttendance,
      getAttendanceByDate,
      getEmployeeAttendance,
      getTodayAttendance,
      calculateWorkingHours,
      updateAttendanceRecord
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendanceContext = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendanceContext must be used within an AttendanceProvider');
  }
  return context;
};
