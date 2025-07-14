import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface AuditLog {
  id: number;
  timestamp: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes: Record<string, { old: any; new: any }>;
  ipAddress?: string;
  userAgent?: string;
}

interface AuditContextType {
  auditLogs: AuditLog[];
  logAction: (action: string, entityType: string, entityId: string, changes?: Record<string, { old: any; new: any }>) => void;
  getAuditLogs: (entityType?: string, entityId?: string) => AuditLog[];
  getRecentLogs: (limit?: number) => AuditLog[];
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export const AuditProvider = ({ children }: { children: ReactNode }) => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 1,
      timestamp: new Date().toISOString(),
      userId: 'admin@cafepay.com',
      action: 'Employee Created',
      entityType: 'Employee',
      entityId: '1',
      changes: {
        name: { old: null, new: 'Priya Sharma' },
        role: { old: null, new: 'Store Manager' }
      }
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      userId: 'hr@cafepay.com',
      action: 'Payroll Processed',
      entityType: 'Payroll',
      entityId: 'December-2024',
      changes: {
        status: { old: 'Draft', new: 'Processed' }
      }
    }
  ]);

  const logAction = (
    action: string, 
    entityType: string, 
    entityId: string, 
    changes?: Record<string, { old: any; new: any }>
  ) => {
    const newLog: AuditLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      userId: 'current-user@cafepay.com', // In real app, get from auth context
      action,
      entityType,
      entityId,
      changes: changes || {},
      ipAddress: '192.168.1.1', // In real app, get from request
      userAgent: navigator.userAgent
    };

    setAuditLogs(prev => [newLog, ...prev]);
  };

  const getAuditLogs = (entityType?: string, entityId?: string) => {
    return auditLogs.filter(log => {
      if (entityType && log.entityType !== entityType) return false;
      if (entityId && log.entityId !== entityId) return false;
      return true;
    });
  };

  const getRecentLogs = (limit: number = 10) => {
    return auditLogs.slice(0, limit);
  };

  return (
    <AuditContext.Provider value={{
      auditLogs,
      logAction,
      getAuditLogs,
      getRecentLogs
    }}>
      {children}
    </AuditContext.Provider>
  );
};

export const useAuditContext = () => {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error('useAuditContext must be used within an AuditProvider');
  }
  return context;
};