import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ComplianceDocument {
  id: number;
  name: string;
  type: 'Form16' | 'PFReturn' | 'ESIReturn' | 'PTReturn' | 'TDSReturn' | 'AuditReport' | 'Other';
  employeeId?: number;
  month?: string;
  year: number;
  status: 'Draft' | 'Generated' | 'Filed' | 'Acknowledged';
  generatedDate?: string;
  filedDate?: string;
  dueDate: string;
  fileUrl?: string;
  complianceData: Record<string, any>;
}

export interface CompanyComplianceConfig {
  companyName: string;
  panNumber: string;
  tanNumber: string;
  pfRegistrationNumber: string;
  esiRegistrationNumber: string;
  ptRegistrationNumber: string;
  gstNumber: string;
  address: string;
  state: string;
  filingDates: {
    tdsQuarterly: string; // "7th of following month"
    pfMonthly: string; // "15th of following month"
    esiMonthly: string; // "21st of following month"
    ptMonthly: string; // "15th of following month"
  };
  complianceOfficer: {
    name: string;
    email: string;
    phone: string;
  };
}

interface ComplianceContextType {
  documents: ComplianceDocument[];
  companyConfig: CompanyComplianceConfig;
  addDocument: (document: Omit<ComplianceDocument, 'id'>) => void;
  updateDocument: (id: number, updates: Partial<ComplianceDocument>) => void;
  getDocumentsByType: (type: string) => ComplianceDocument[];
  getUpcomingDeadlines: (days?: number) => ComplianceDocument[];
  updateCompanyConfig: (config: Partial<CompanyComplianceConfig>) => void;
  generateReport: (type: string, month: string, year: number) => ComplianceDocument;
}

const ComplianceContext = createContext<ComplianceContextType | undefined>(undefined);

const defaultCompanyConfig: CompanyComplianceConfig = {
  companyName: 'Mumbai Cafe Chain Pvt. Ltd.',
  panNumber: 'ABCDE1234F',
  tanNumber: 'MUMM01234E',
  pfRegistrationNumber: 'MH/BOM/12345',
  esiRegistrationNumber: '1234567890',
  ptRegistrationNumber: 'PT001234567',
  gstNumber: '27ABCDE1234F1Z5',
  address: '123 Business Park, Bandra Kurla Complex, Mumbai 400051',
  state: 'Maharashtra',
  filingDates: {
    tdsQuarterly: '7th of following month',
    pfMonthly: '15th of following month',
    esiMonthly: '21st of following month',
    ptMonthly: '15th of following month'
  },
  complianceOfficer: {
    name: 'Ravi Kumar',
    email: 'compliance@cafepay.com',
    phone: '+91 98765 43210'
  }
};

export const ComplianceProvider = ({ children }: { children: ReactNode }) => {
  const [documents, setDocuments] = useState<ComplianceDocument[]>([
    {
      id: 1,
      name: 'PF Return - November 2024',
      type: 'PFReturn',
      month: 'November',
      year: 2024,
      status: 'Filed',
      generatedDate: '2024-12-10',
      filedDate: '2024-12-15',
      dueDate: '2024-12-15',
      complianceData: {}
    },
    {
      id: 2,
      name: 'TDS Return - Q3 2024',
      type: 'TDSReturn',
      year: 2024,
      status: 'Draft',
      dueDate: '2025-01-07',
      complianceData: {}
    }
  ]);

  const [companyConfig, setCompanyConfig] = useState<CompanyComplianceConfig>(defaultCompanyConfig);

  const addDocument = (documentData: Omit<ComplianceDocument, 'id'>) => {
    const newDocument: ComplianceDocument = {
      ...documentData,
      id: Date.now()
    };
    setDocuments(prev => [...prev, newDocument]);
  };

  const updateDocument = (id: number, updates: Partial<ComplianceDocument>) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, ...updates } : doc
    ));
  };

  const getDocumentsByType = (type: string) => {
    return documents.filter(doc => doc.type === type);
  };

  const getUpcomingDeadlines = (days: number = 30) => {
    const today = new Date();
    const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));
    
    return documents.filter(doc => {
      const dueDate = new Date(doc.dueDate);
      return dueDate >= today && dueDate <= futureDate && doc.status !== 'Filed';
    }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };

  const updateCompanyConfig = (config: Partial<CompanyComplianceConfig>) => {
    setCompanyConfig(prev => ({ ...prev, ...config }));
  };

  const generateReport = (type: string, month: string, year: number): ComplianceDocument => {
    const newDocument: ComplianceDocument = {
      id: Date.now(),
      name: `${type} - ${month} ${year}`,
      type: type as any,
      month,
      year,
      status: 'Generated',
      generatedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      complianceData: {}
    };

    setDocuments(prev => [...prev, newDocument]);
    return newDocument;
  };

  return (
    <ComplianceContext.Provider value={{
      documents,
      companyConfig,
      addDocument,
      updateDocument,
      getDocumentsByType,
      getUpcomingDeadlines,
      updateCompanyConfig,
      generateReport
    }}>
      {children}
    </ComplianceContext.Provider>
  );
};

export const useComplianceContext = () => {
  const context = useContext(ComplianceContext);
  if (!context) {
    throw new Error('useComplianceContext must be used within a ComplianceProvider');
  }
  return context;
};