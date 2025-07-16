import React, { createContext, useContext, useState, ReactNode } from 'react';

// Core interfaces for the wage configuration system
export type PayType = 'Monthly' | 'Hourly' | 'Daily' | 'Piece-rate' | 'Commission';
export type Industry = 'IT' | 'Hospitality' | 'Manufacturing' | 'Retail' | 'Custom';
export type VariablePayType = 'bonus' | 'commission' | 'tips' | 'incentive' | 'premium' | 'allowance';

export interface CommissionStructure {
  type: 'percentage' | 'tiered' | 'flat';
  rate?: number; // For percentage and flat
  tiers?: { min: number; max: number; rate: number }[]; // For tiered
  target?: number; // Sales target for percentage calculations
}

export interface PieceRateStructure {
  taskType: string;
  ratePerUnit: number;
  minimumUnits?: number;
  bonusThreshold?: number;
  bonusRate?: number;
}

export interface VariablePayComponent {
  id: string;
  type: VariablePayType;
  name: string;
  description?: string;
  calculationMethod: 'fixed' | 'percentage' | 'formula' | 'hours_based' | 'units_based';
  amount?: number;
  percentage?: number;
  formula?: string;
  conditions?: {
    minHours?: number;
    maxHours?: number;
    shiftType?: string;
    department?: string;
    performanceMetric?: string;
  };
  taxable: boolean;
  includeInStatutory: boolean;
  active: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface HourlyRateStructure {
  regularRate: number;
  overtimeRate: number;
  weekendRate: number;
  holidayRate: number;
  nightShiftDifferential: number; // percentage
}

export interface WageConfiguration {
  industry: Industry;
  defaultPayType: PayType;
  variablePayEnabled: boolean;
  approvalRequired: boolean;
  minimumWage: {
    hourly: number;
    daily: number;
    monthly: number;
  };
  hourlyRates: {
    [department: string]: HourlyRateStructure;
  };
  pieceRates: PieceRateStructure[];
  commissionStructures: {
    [role: string]: CommissionStructure;
  };
  variablePayComponents: VariablePayComponent[];
  autoCalculationRules: {
    attendanceBonus: boolean;
    punctualityBonus: boolean;
    overtimeAutoApproval: boolean;
    tipPooling: boolean;
    performanceLinked: boolean;
  };
}

export interface IndustryTemplate {
  name: Industry;
  displayName: string;
  defaultConfig: Partial<WageConfiguration>;
  commonVariablePayComponents: Omit<VariablePayComponent, 'id'>[];
  suggestedRoles: string[];
}

interface WageConfigurationContextType {
  configuration: WageConfiguration;
  industryTemplates: IndustryTemplate[];
  updateConfiguration: (config: Partial<WageConfiguration>) => void;
  addVariablePayComponent: (component: Omit<VariablePayComponent, 'id'>) => void;
  updateVariablePayComponent: (id: string, component: Partial<VariablePayComponent>) => void;
  removeVariablePayComponent: (id: string) => void;
  applyIndustryTemplate: (industry: Industry) => void;
  getHourlyRate: (department: string, shiftType?: string) => number;
  calculateVariablePay: (employeeId: number, month: string, year: number) => { [componentId: string]: number };
}

const WageConfigurationContext = createContext<WageConfigurationContextType | undefined>(undefined);

// Industry templates
const industryTemplates: IndustryTemplate[] = [
  {
    name: 'IT',
    displayName: 'Information Technology',
    defaultConfig: {
      industry: 'IT',
      defaultPayType: 'Monthly',
      variablePayEnabled: true,
      minimumWage: { hourly: 500, daily: 4000, monthly: 120000 }
    },
    commonVariablePayComponents: [
      {
        type: 'bonus',
        name: 'Performance Bonus',
        calculationMethod: 'percentage',
        percentage: 10,
        taxable: true,
        includeInStatutory: true,
        active: true,
        effectiveFrom: new Date().toISOString()
      },
      {
        type: 'allowance',
        name: 'Internet Allowance',
        calculationMethod: 'fixed',
        amount: 2000,
        taxable: true,
        includeInStatutory: true,
        active: true,
        effectiveFrom: new Date().toISOString()
      }
    ],
    suggestedRoles: ['Software Engineer', 'Data Analyst', 'Project Manager', 'QA Engineer']
  },
  {
    name: 'Hospitality',
    displayName: 'Hospitality & Food Service',
    defaultConfig: {
      industry: 'Hospitality',
      defaultPayType: 'Hourly',
      variablePayEnabled: true,
      minimumWage: { hourly: 200, daily: 1600, monthly: 48000 }
    },
    commonVariablePayComponents: [
      {
        type: 'tips',
        name: 'Customer Tips',
        calculationMethod: 'fixed',
        taxable: true,
        includeInStatutory: false,
        active: true,
        effectiveFrom: new Date().toISOString()
      },
      {
        type: 'premium',
        name: 'Weekend Premium',
        calculationMethod: 'percentage',
        percentage: 25,
        conditions: { shiftType: 'Weekend' },
        taxable: true,
        includeInStatutory: true,
        active: true,
        effectiveFrom: new Date().toISOString()
      },
      {
        type: 'bonus',
        name: 'Service Excellence Bonus',
        calculationMethod: 'fixed',
        amount: 5000,
        taxable: true,
        includeInStatutory: true,
        active: true,
        effectiveFrom: new Date().toISOString()
      }
    ],
    suggestedRoles: ['Waiter', 'Chef', 'Bartender', 'Host', 'Kitchen Staff']
  },
  {
    name: 'Manufacturing',
    displayName: 'Manufacturing & Production',
    defaultConfig: {
      industry: 'Manufacturing',
      defaultPayType: 'Piece-rate',
      variablePayEnabled: true,
      minimumWage: { hourly: 150, daily: 1200, monthly: 36000 }
    },
    commonVariablePayComponents: [
      {
        type: 'bonus',
        name: 'Production Bonus',
        calculationMethod: 'units_based',
        taxable: true,
        includeInStatutory: true,
        active: true,
        effectiveFrom: new Date().toISOString()
      },
      {
        type: 'premium',
        name: 'Quality Bonus',
        calculationMethod: 'percentage',
        percentage: 15,
        taxable: true,
        includeInStatutory: true,
        active: true,
        effectiveFrom: new Date().toISOString()
      },
      {
        type: 'allowance',
        name: 'Safety Gear Allowance',
        calculationMethod: 'fixed',
        amount: 1500,
        taxable: false,
        includeInStatutory: false,
        active: true,
        effectiveFrom: new Date().toISOString()
      }
    ],
    suggestedRoles: ['Production Worker', 'Machine Operator', 'Quality Inspector', 'Supervisor']
  },
  {
    name: 'Retail',
    displayName: 'Retail & Sales',
    defaultConfig: {
      industry: 'Retail',
      defaultPayType: 'Hourly',
      variablePayEnabled: true,
      minimumWage: { hourly: 180, daily: 1440, monthly: 43200 }
    },
    commonVariablePayComponents: [
      {
        type: 'commission',
        name: 'Sales Commission',
        calculationMethod: 'percentage',
        percentage: 2,
        taxable: true,
        includeInStatutory: true,
        active: true,
        effectiveFrom: new Date().toISOString()
      },
      {
        type: 'bonus',
        name: 'Target Achievement Bonus',
        calculationMethod: 'fixed',
        amount: 8000,
        taxable: true,
        includeInStatutory: true,
        active: true,
        effectiveFrom: new Date().toISOString()
      },
      {
        type: 'incentive',
        name: 'Customer Service Incentive',
        calculationMethod: 'percentage',
        percentage: 5,
        taxable: true,
        includeInStatutory: true,
        active: true,
        effectiveFrom: new Date().toISOString()
      }
    ],
    suggestedRoles: ['Sales Associate', 'Cashier', 'Store Manager', 'Inventory Specialist']
  }
];

const defaultConfiguration: WageConfiguration = {
  industry: 'Custom',
  defaultPayType: 'Monthly',
  variablePayEnabled: false,
  approvalRequired: true,
  minimumWage: {
    hourly: 200,
    daily: 1600,
    monthly: 48000
  },
  hourlyRates: {},
  pieceRates: [],
  commissionStructures: {},
  variablePayComponents: [],
  autoCalculationRules: {
    attendanceBonus: false,
    punctualityBonus: false,
    overtimeAutoApproval: false,
    tipPooling: false,
    performanceLinked: false
  }
};

export const WageConfigurationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [configuration, setConfiguration] = useState<WageConfiguration>(() => {
    const saved = localStorage.getItem('wageConfiguration');
    return saved ? JSON.parse(saved) : defaultConfiguration;
  });

  const updateConfiguration = (config: Partial<WageConfiguration>) => {
    const updated = { ...configuration, ...config };
    setConfiguration(updated);
    localStorage.setItem('wageConfiguration', JSON.stringify(updated));
  };

  const addVariablePayComponent = (component: Omit<VariablePayComponent, 'id'>) => {
    const newComponent: VariablePayComponent = {
      ...component,
      id: `vpc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    const updated = {
      ...configuration,
      variablePayComponents: [...configuration.variablePayComponents, newComponent]
    };
    
    setConfiguration(updated);
    localStorage.setItem('wageConfiguration', JSON.stringify(updated));
  };

  const updateVariablePayComponent = (id: string, component: Partial<VariablePayComponent>) => {
    const updated = {
      ...configuration,
      variablePayComponents: configuration.variablePayComponents.map(vpc =>
        vpc.id === id ? { ...vpc, ...component } : vpc
      )
    };
    
    setConfiguration(updated);
    localStorage.setItem('wageConfiguration', JSON.stringify(updated));
  };

  const removeVariablePayComponent = (id: string) => {
    const updated = {
      ...configuration,
      variablePayComponents: configuration.variablePayComponents.filter(vpc => vpc.id !== id)
    };
    
    setConfiguration(updated);
    localStorage.setItem('wageConfiguration', JSON.stringify(updated));
  };

  const applyIndustryTemplate = (industry: Industry) => {
    const template = industryTemplates.find(t => t.name === industry);
    if (!template) return;

    const variablePayComponents = template.commonVariablePayComponents.map(component => ({
      ...component,
      id: `vpc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }));

    const updated = {
      ...configuration,
      ...template.defaultConfig,
      variablePayComponents
    };

    setConfiguration(updated);
    localStorage.setItem('wageConfiguration', JSON.stringify(updated));
  };

  const getHourlyRate = (department: string, shiftType?: string): number => {
    const deptRates = configuration.hourlyRates[department];
    if (!deptRates) return configuration.minimumWage.hourly;

    switch (shiftType) {
      case 'Weekend':
        return deptRates.weekendRate;
      case 'Night':
        return deptRates.regularRate * (1 + deptRates.nightShiftDifferential / 100);
      default:
        return deptRates.regularRate;
    }
  };

  const calculateVariablePay = (employeeId: number, month: string, year: number): { [componentId: string]: number } => {
    // This is a simplified calculation - in reality, you'd fetch actual data
    const results: { [componentId: string]: number } = {};
    
    configuration.variablePayComponents.forEach(component => {
      if (!component.active) return;
      
      switch (component.calculationMethod) {
        case 'fixed':
          results[component.id] = component.amount || 0;
          break;
        case 'percentage':
          // This would calculate based on base salary or other metrics
          results[component.id] = (component.percentage || 0) * 100; // Simplified
          break;
        default:
          results[component.id] = 0;
      }
    });
    
    return results;
  };

  const value = {
    configuration,
    industryTemplates,
    updateConfiguration,
    addVariablePayComponent,
    updateVariablePayComponent,
    removeVariablePayComponent,
    applyIndustryTemplate,
    getHourlyRate,
    calculateVariablePay
  };

  return (
    <WageConfigurationContext.Provider value={value}>
      {children}
    </WageConfigurationContext.Provider>
  );
};

export const useWageConfiguration = () => {
  const context = useContext(WageConfigurationContext);
  if (context === undefined) {
    throw new Error('useWageConfiguration must be used within a WageConfigurationProvider');
  }
  return context;
};