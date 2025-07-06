import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface SalaryStructure {
  basic: number;
  hra: number;
  da: number; // Dearness Allowance
  specialAllowance: number;
  medicalAllowance: number;
  conveyanceAllowance: number;
  otherAllowances: number;
  ctc: number; // Cost to Company
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  location: string;
  salary: number; // Keep for backward compatibility
  salaryStructure: SalaryStructure;
  joinDate: string;
  dateOfBirth: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  employmentType: 'Full-time' | 'Part-time' | 'Contract';
  address: string;
  panNumber: string;
  aadhaarNumber: string;
  pfAccount: string;
  esiNumber: string;
  bankAccountNumber: string;
  ifscCode: string;
  bankName: string;
  avatar: string;
  state: string; // For Professional Tax calculation
  defaultShiftId?: number; // New field for permanent shift assignment
}

interface EmployeeContextType {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id' | 'avatar'>) => void;
  updateEmployee: (id: number, employee: Partial<Employee>) => void;
  deleteEmployee: (id: number) => void;
  calculateSalaryStructure: (ctc: number) => SalaryStructure;
  assignDefaultShift: (employeeId: number, shiftId: number) => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

const calculateDefaultSalaryStructure = (ctc: number): SalaryStructure => {
  const basic = Math.round(ctc * 0.5); // 50% of CTC
  const hra = Math.round(basic * 0.4); // 40% of Basic
  const da = Math.round(basic * 0.12); // 12% of Basic
  const specialAllowance = Math.round(ctc * 0.15); // 15% of CTC
  const medicalAllowance = 1250; // Fixed as per IT Act
  const conveyanceAllowance = 1600; // Fixed as per IT Act
  const otherAllowances = ctc - (basic + hra + da + specialAllowance + medicalAllowance + conveyanceAllowance);
  
  return {
    basic,
    hra,
    da,
    specialAllowance,
    medicalAllowance,
    conveyanceAllowance,
    otherAllowances: Math.max(0, otherAllowances),
    ctc
  };
};

const initialEmployees: Employee[] = [
  {
    id: 1,
    name: "Priya Sharma",
    email: "priya.sharma@cafepay.com",
    phone: "+91 98765 43210",
    role: "Store Manager",
    department: "Operations",
    location: "Bandra West",
    salary: 45000,
    salaryStructure: calculateDefaultSalaryStructure(540000), // Annual CTC
    joinDate: "2023-03-15",
    dateOfBirth: "1990-07-12",
    status: "Active",
    employmentType: "Full-time",
    address: "123 Hill Road, Bandra West, Mumbai 400050",
    panNumber: "ABCDE1234F",
    aadhaarNumber: "1234 5678 9012",
    pfAccount: "MH/BOM/12345/678",
    esiNumber: "1001234567",
    bankAccountNumber: "12345678901234",
    ifscCode: "HDFC0001234",
    bankName: "HDFC Bank",
    avatar: "PS",
    state: "Maharashtra",
    defaultShiftId: 1
  },
  {
    id: 2,
    name: "Rohit Patel",
    email: "rohit.patel@cafepay.com",
    phone: "+91 87654 32109",
    role: "Barista",
    department: "Food & Beverage",
    location: "Andheri East",
    salary: 25000,
    salaryStructure: calculateDefaultSalaryStructure(300000),
    joinDate: "2023-06-20",
    dateOfBirth: "1995-02-18",
    status: "Active",
    employmentType: "Full-time",
    address: "456 SV Road, Andheri East, Mumbai 400069",
    panNumber: "FGHIJ5678K",
    aadhaarNumber: "2345 6789 0123",
    pfAccount: "MH/BOM/23456/789",
    esiNumber: "1002345678",
    bankAccountNumber: "23456789012345",
    ifscCode: "ICICI0005678",
    bankName: "ICICI Bank",
    avatar: "RP",
    state: "Maharashtra",
    defaultShiftId: 1
  },
  {
    id: 3,
    name: "Sneha Kulkarni",
    email: "sneha.k@cafepay.com",
    phone: "+91 76543 21098",
    role: "Cashier",
    department: "Customer Service",
    location: "Powai",
    salary: 22000,
    salaryStructure: calculateDefaultSalaryStructure(264000),
    joinDate: "2023-08-10",
    dateOfBirth: "1998-11-05",
    status: "Active",
    employmentType: "Full-time",
    address: "789 Hiranandani Gardens, Powai, Mumbai 400076",
    panNumber: "KLMNO9012P",
    aadhaarNumber: "3456 7890 1234",
    pfAccount: "MH/BOM/34567/890",
    esiNumber: "1003456789",
    bankAccountNumber: "34567890123456",
    ifscCode: "SBI0009012",
    bankName: "State Bank of India",
    avatar: "SK",
    state: "Maharashtra",
    defaultShiftId: 2
  },
  {
    id: 4,
    name: "Arjun Singh",
    email: "arjun.singh@cafepay.com",
    phone: "+91 65432 10987",
    role: "Kitchen Staff",
    department: "Food Preparation",
    location: "Bandra West",
    salary: 20000,
    salaryStructure: calculateDefaultSalaryStructure(240000),
    joinDate: "2023-09-05",
    dateOfBirth: "1992-04-22",
    status: "On Leave",
    employmentType: "Full-time",
    address: "321 Linking Road, Bandra West, Mumbai 400050",
    panNumber: "QRSTU3456V",
    aadhaarNumber: "4567 8901 2345",
    pfAccount: "MH/BOM/45678/901",
    esiNumber: "1004567890",
    bankAccountNumber: "45678901234567",
    ifscCode: "AXIS0003456",
    bankName: "Axis Bank",
    avatar: "AS",
    state: "Maharashtra",
    defaultShiftId: 1
  },
  {
    id: 5,
    name: "Meera Reddy",
    email: "meera.reddy@cafepay.com",
    phone: "+91 98765 54321",
    role: "Assistant Manager",
    department: "Operations",
    location: "Juhu",
    salary: 35000,
    salaryStructure: calculateDefaultSalaryStructure(420000),
    joinDate: "2023-01-10",
    dateOfBirth: "1988-09-15",
    status: "Active",
    employmentType: "Full-time",
    address: "567 Juhu Beach Road, Juhu, Mumbai 400049",
    panNumber: "WXYZ7890A",
    aadhaarNumber: "5678 9012 3456",
    pfAccount: "MH/BOM/56789/012",
    esiNumber: "1005678901",
    bankAccountNumber: "56789012345678",
    ifscCode: "KOTAK0007890",
    bankName: "Kotak Mahindra Bank",
    avatar: "MR",
    state: "Maharashtra",
    defaultShiftId: 3
  }
];

export const EmployeeProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  const calculateSalaryStructure = (ctc: number): SalaryStructure => {
    return calculateDefaultSalaryStructure(ctc);
  };

  const addEmployee = (employeeData: Omit<Employee, 'id' | 'avatar'>) => {
    const newId = Math.max(...employees.map(e => e.id)) + 1;
    const avatar = employeeData.name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    const newEmployee: Employee = {
      ...employeeData,
      id: newId,
      avatar
    };
    
    setEmployees(prev => [...prev, newEmployee]);
  };

  const updateEmployee = (id: number, employeeData: Partial<Employee>) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === id ? { ...emp, ...employeeData } : emp
    ));
  };

  const deleteEmployee = (id: number) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  const assignDefaultShift = (employeeId: number, shiftId: number) => {
    updateEmployee(employeeId, { defaultShiftId: shiftId });
  };

  return (
    <EmployeeContext.Provider value={{
      employees,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      calculateSalaryStructure,
      assignDefaultShift
    }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployeeContext = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployeeContext must be used within an EmployeeProvider');
  }
  return context;
};
