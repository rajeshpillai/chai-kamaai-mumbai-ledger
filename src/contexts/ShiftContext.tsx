
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ShiftType = 'Day' | 'Night' | 'Weekend';

export interface Shift {
  id: number;
  name: string;
  type: ShiftType;
  startTime: string;
  endTime: string;
  standardHours: number;
  overtimeMultiplier: number;
  nightDifferential?: number; // Additional percentage for night shifts
}

export interface ShiftAssignment {
  id: number;
  employeeId: number;
  shiftId: number;
  date: string;
  status: 'Scheduled' | 'Completed' | 'Missed';
}

interface ShiftContextType {
  shifts: Shift[];
  shiftAssignments: ShiftAssignment[];
  addShift: (shift: Omit<Shift, 'id'>) => void;
  updateShift: (id: number, shift: Partial<Shift>) => void;
  deleteShift: (id: number) => void;
  assignShift: (employeeId: number, shiftId: number, date: string) => void;
  getShiftById: (id: number) => Shift | undefined;
  getEmployeeShift: (employeeId: number, date: string) => { shift: Shift; assignment: ShiftAssignment } | null;
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

const defaultShifts: Shift[] = [
  {
    id: 1,
    name: 'Morning Shift',
    type: 'Day',
    startTime: '09:00',
    endTime: '17:00',
    standardHours: 8,
    overtimeMultiplier: 1.5
  },
  {
    id: 2,
    name: 'Night Shift',
    type: 'Night',
    startTime: '22:00',
    endTime: '06:00',
    standardHours: 8,
    overtimeMultiplier: 1.5,
    nightDifferential: 15 // 15% additional pay
  },
  {
    id: 3,
    name: 'Weekend Shift',
    type: 'Weekend',
    startTime: '10:00',
    endTime: '18:00',
    standardHours: 8,
    overtimeMultiplier: 2.0
  }
];

export const ShiftProvider = ({ children }: { children: ReactNode }) => {
  const [shifts, setShifts] = useState<Shift[]>(defaultShifts);
  const [shiftAssignments, setShiftAssignments] = useState<ShiftAssignment[]>([]);

  const addShift = (shiftData: Omit<Shift, 'id'>) => {
    const newId = Math.max(...shifts.map(s => s.id), 0) + 1;
    setShifts(prev => [...prev, { ...shiftData, id: newId }]);
  };

  const updateShift = (id: number, shiftData: Partial<Shift>) => {
    setShifts(prev => prev.map(shift => 
      shift.id === id ? { ...shift, ...shiftData } : shift
    ));
  };

  const deleteShift = (id: number) => {
    setShifts(prev => prev.filter(shift => shift.id !== id));
    setShiftAssignments(prev => prev.filter(assignment => assignment.shiftId !== id));
  };

  const assignShift = (employeeId: number, shiftId: number, date: string) => {
    const newId = Math.max(...shiftAssignments.map(a => a.id), 0) + 1;
    setShiftAssignments(prev => [...prev, {
      id: newId,
      employeeId,
      shiftId,
      date,
      status: 'Scheduled'
    }]);
  };

  const getShiftById = (id: number) => {
    return shifts.find(shift => shift.id === id);
  };

  const getEmployeeShift = (employeeId: number, date: string) => {
    const assignment = shiftAssignments.find(a => 
      a.employeeId === employeeId && a.date === date
    );
    if (!assignment) return null;
    
    const shift = getShiftById(assignment.shiftId);
    if (!shift) return null;
    
    return { shift, assignment };
  };

  return (
    <ShiftContext.Provider value={{
      shifts,
      shiftAssignments,
      addShift,
      updateShift,
      deleteShift,
      assignShift,
      getShiftById,
      getEmployeeShift
    }}>
      {children}
    </ShiftContext.Provider>
  );
};

export const useShiftContext = () => {
  const context = useContext(ShiftContext);
  if (!context) {
    throw new Error('useShiftContext must be used within a ShiftProvider');
  }
  return context;
};
