
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface AttendanceRecord {
  id: number;
  employeeId: number;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day';
  location: string;
  notes?: string;
}

interface AttendanceContextType {
  attendanceRecords: AttendanceRecord[];
  markAttendance: (employeeId: number, type: 'checkin' | 'checkout', location: string) => void;
  getAttendanceByDate: (date: string) => AttendanceRecord[];
  getEmployeeAttendance: (employeeId: number) => AttendanceRecord[];
  getTodayAttendance: () => AttendanceRecord[];
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
    location: 'Bandra West'
  },
  {
    id: 2,
    employeeId: 2,
    date: '2025-01-06',
    checkIn: '09:15',
    checkOut: '18:30',
    status: 'Late',
    location: 'Andheri East'
  },
  {
    id: 3,
    employeeId: 3,
    date: '2025-01-06',
    checkIn: '09:00',
    checkOut: null,
    status: 'Present',
    location: 'Powai'
  }
];

export const AttendanceProvider = ({ children }: { children: ReactNode }) => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initialRecords);

  const markAttendance = (employeeId: number, type: 'checkin' | 'checkout', location: string) => {
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
            if (type === 'checkout') {
              return { ...record, checkOut: currentTime };
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
          location
        }];
      }
      
      return prev;
    });
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
      getTodayAttendance
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
