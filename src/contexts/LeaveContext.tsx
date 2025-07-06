
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type LeaveType = 'Annual' | 'Sick' | 'Casual' | 'Maternity' | 'Paternity' | 'Emergency';

export interface LeaveBalance {
  employeeId: number;
  annual: number;
  sick: number;
  casual: number;
  maternity: number;
  paternity: number;
  emergency: number;
}

export interface LeaveRequest {
  id: number;
  employeeId: number;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
  approvedBy?: number;
  approvedDate?: string;
  isPaid: boolean;
}

interface LeaveContextType {
  leaveBalances: LeaveBalance[];
  leaveRequests: LeaveRequest[];
  applyLeave: (request: Omit<LeaveRequest, 'id' | 'appliedDate' | 'status'>) => void;
  approveLeave: (requestId: number, approverId: number) => void;
  rejectLeave: (requestId: number) => void;
  getEmployeeBalance: (employeeId: number) => LeaveBalance | null;
  getEmployeeLeaveHistory: (employeeId: number) => LeaveRequest[];
  initializeEmployeeBalance: (employeeId: number) => void;
  isOnLeave: (employeeId: number, date: string) => boolean;
  getApprovedLeaveForMonth: (employeeId: number, month: number, year: number) => LeaveRequest[];
}

const LeaveContext = createContext<LeaveContextType | undefined>(undefined);

const defaultLeaveBalance = {
  annual: 21, // 21 days annual leave
  sick: 12,   // 12 days sick leave
  casual: 12, // 12 days casual leave
  maternity: 180, // 6 months maternity leave
  paternity: 15,  // 15 days paternity leave
  emergency: 5    // 5 days emergency leave
};

export const LeaveProvider = ({ children }: { children: ReactNode }) => {
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

  const initializeEmployeeBalance = (employeeId: number) => {
    const exists = leaveBalances.find(balance => balance.employeeId === employeeId);
    if (!exists) {
      setLeaveBalances(prev => [...prev, { employeeId, ...defaultLeaveBalance }]);
    }
  };

  const applyLeave = (requestData: Omit<LeaveRequest, 'id' | 'appliedDate' | 'status'>) => {
    const newId = Math.max(...leaveRequests.map(r => r.id), 0) + 1;
    const newRequest: LeaveRequest = {
      ...requestData,
      id: newId,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setLeaveRequests(prev => [...prev, newRequest]);
  };

  const approveLeave = (requestId: number, approverId: number) => {
    setLeaveRequests(prev => prev.map(request => {
      if (request.id === requestId) {
        // Deduct from balance
        const leaveTypeKey = request.type.toLowerCase() as keyof Omit<LeaveBalance, 'employeeId'>;
        setLeaveBalances(balances => balances.map(balance => {
          if (balance.employeeId === request.employeeId) {
            return {
              ...balance,
              [leaveTypeKey]: Math.max(0, balance[leaveTypeKey] - request.days)
            };
          }
          return balance;
        }));

        return {
          ...request,
          status: 'Approved' as const,
          approvedBy: approverId,
          approvedDate: new Date().toISOString().split('T')[0]
        };
      }
      return request;
    }));
  };

  const rejectLeave = (requestId: number) => {
    setLeaveRequests(prev => prev.map(request => 
      request.id === requestId ? { ...request, status: 'Rejected' as const } : request
    ));
  };

  const getEmployeeBalance = (employeeId: number) => {
    return leaveBalances.find(balance => balance.employeeId === employeeId) || null;
  };

  const getEmployeeLeaveHistory = (employeeId: number) => {
    return leaveRequests.filter(request => request.employeeId === employeeId);
  };

  const isOnLeave = (employeeId: number, date: string) => {
    const approvedLeaves = leaveRequests.filter(request => 
      request.employeeId === employeeId && 
      request.status === 'Approved' &&
      date >= request.startDate && 
      date <= request.endDate
    );
    return approvedLeaves.length > 0;
  };

  const getApprovedLeaveForMonth = (employeeId: number, month: number, year: number) => {
    return leaveRequests.filter(request => {
      if (request.employeeId !== employeeId || request.status !== 'Approved') return false;
      
      const startDate = new Date(request.startDate);
      const endDate = new Date(request.endDate);
      const monthStart = new Date(year, month - 1, 1);
      const monthEnd = new Date(year, month, 0);
      
      return (startDate <= monthEnd && endDate >= monthStart);
    });
  };

  return (
    <LeaveContext.Provider value={{
      leaveBalances,
      leaveRequests,
      applyLeave,
      approveLeave,
      rejectLeave,
      getEmployeeBalance,
      getEmployeeLeaveHistory,
      initializeEmployeeBalance,
      isOnLeave,
      getApprovedLeaveForMonth
    }}>
      {children}
    </LeaveContext.Provider>
  );
};

export const useLeaveContext = () => {
  const context = useContext(LeaveContext);
  if (!context) {
    throw new Error('useLeaveContext must be used within a LeaveProvider');
  }
  return context;
};
