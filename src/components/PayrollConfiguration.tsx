
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Save, Settings, Calculator, Clock, DollarSign, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PayrollRules {
  overtime: {
    enabled: boolean;
    weekdayMultiplier: number;
    weekendMultiplier: number;
    holidayMultiplier: number;
    maxDailyHours: number;
    maxWeeklyHours: number;
    autoCalculate: boolean;
  };
  attendance: {
    lateDeductionEnabled: boolean;
    lateDeductionPercentage: number;
    absentDeductionEnabled: boolean;
    halfDayThreshold: number;
    minimumWorkingHours: number;
  };
  statutory: {
    pfEnabled: boolean;
    pfRate: number;
    pfCeiling: number;
    esiEnabled: boolean;
    esiEmployeeRate: number;
    esiEmployerRate: number;
    esiCeiling: number;
    professionalTaxEnabled: boolean;
    tdsEnabled: boolean;
  };
  leave: {
    unpaidLeaveDeduction: boolean;
    leaveEncashmentEnabled: boolean;
    encashmentRate: number;
    maxEncashmentDays: number;
  };
  salary: {
    autoStructureCalculation: boolean;
    basicSalaryPercentage: number;
    hraPercentage: number;
    daPercentage: number;
    payrollCycle: 'monthly' | 'biweekly' | 'weekly';
    payrollProcessingDay: number;
  };
}

const PayrollConfiguration = () => {
  const { toast } = useToast();
  const [rules, setRules] = useState<PayrollRules>({
    overtime: {
      enabled: true,
      weekdayMultiplier: 1.5,
      weekendMultiplier: 2.0,
      holidayMultiplier: 2.5,
      maxDailyHours: 4,
      maxWeeklyHours: 20,
      autoCalculate: true
    },
    attendance: {
      lateDeductionEnabled: true,
      lateDeductionPercentage: 10,
      absentDeductionEnabled: true,
      halfDayThreshold: 4,
      minimumWorkingHours: 8
    },
    statutory: {
      pfEnabled: true,
      pfRate: 12,
      pfCeiling: 15000,
      esiEnabled: true,
      esiEmployeeRate: 0.75,
      esiEmployerRate: 3.25,
      esiCeiling: 21000,
      professionalTaxEnabled: true,
      tdsEnabled: true
    },
    leave: {
      unpaidLeaveDeduction: true,
      leaveEncashmentEnabled: true,
      encashmentRate: 100,
      maxEncashmentDays: 30
    },
    salary: {
      autoStructureCalculation: true,
      basicSalaryPercentage: 50,
      hraPercentage: 40,
      daPercentage: 12,
      payrollCycle: 'monthly',
      payrollProcessingDay: 1
    }
  });

  const handleSave = () => {
    // In a real app, this would save to a backend
    localStorage.setItem('payrollRules', JSON.stringify(rules));
    toast({
      title: "Payroll Rules Saved",
      description: "All payroll configuration has been updated successfully.",
    });
  };

  const updateRule = (section: keyof PayrollRules, field: string, value: any) => {
    setRules(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Payroll Rules & Configuration</h2>
          <p className="text-gray-600">Configure payroll policies, deductions, and calculation rules</p>
        </div>
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4 mr-2" />
          Save Configuration
        </Button>
      </div>

      <Tabs defaultValue="overtime" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overtime" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Overtime
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="statutory" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Statutory
          </TabsTrigger>
          <TabsTrigger value="leave" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Leave Rules
          </TabsTrigger>
          <TabsTrigger value="salary" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Salary Structure
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overtime">
          <Card>
            <CardHeader>
              <CardTitle>Overtime Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="overtime-enabled">Enable Overtime Calculations</Label>
                  <p className="text-sm text-gray-600">Automatically calculate overtime pay based on rules</p>
                </div>
                <Switch
                  id="overtime-enabled"
                  checked={rules.overtime.enabled}
                  onCheckedChange={(value) => updateRule('overtime', 'enabled', value)}
                />
              </div>

              {rules.overtime.enabled && (
                <>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="weekday-multiplier">Weekday Overtime Multiplier</Label>
                      <Input
                        id="weekday-multiplier"
                        type="number"
                        step="0.1"
                        value={rules.overtime.weekdayMultiplier}
                        onChange={(e) => updateRule('overtime', 'weekdayMultiplier', parseFloat(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="weekend-multiplier">Weekend Overtime Multiplier</Label>
                      <Input
                        id="weekend-multiplier"
                        type="number"
                        step="0.1"
                        value={rules.overtime.weekendMultiplier}
                        onChange={(e) => updateRule('overtime', 'weekendMultiplier', parseFloat(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="holiday-multiplier">Holiday Overtime Multiplier</Label>
                      <Input
                        id="holiday-multiplier"
                        type="number"
                        step="0.1"
                        value={rules.overtime.holidayMultiplier}
                        onChange={(e) => updateRule('overtime', 'holidayMultiplier', parseFloat(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="max-daily-hours">Max Daily Overtime Hours</Label>
                      <Input
                        id="max-daily-hours"
                        type="number"
                        value={rules.overtime.maxDailyHours}
                        onChange={(e) => updateRule('overtime', 'maxDailyHours', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Late Arrival Deduction</Label>
                      <p className="text-sm text-gray-600">Deduct salary for late arrivals</p>
                    </div>
                    <Switch
                      checked={rules.attendance.lateDeductionEnabled}
                      onCheckedChange={(value) => updateRule('attendance', 'lateDeductionEnabled', value)}
                    />
                  </div>
                  
                  {rules.attendance.lateDeductionEnabled && (
                    <div>
                      <Label htmlFor="late-deduction-percentage">Late Deduction (%)</Label>
                      <Input
                        id="late-deduction-percentage"
                        type="number"
                        value={rules.attendance.lateDeductionPercentage}
                        onChange={(e) => updateRule('attendance', 'lateDeductionPercentage', parseInt(e.target.value))}
                      />
                      <p className="text-xs text-gray-500 mt-1">Percentage of daily salary to deduct per late day</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Absent Day Deduction</Label>
                      <p className="text-sm text-gray-600">Deduct salary for absent days</p>
                    </div>
                    <Switch
                      checked={rules.attendance.absentDeductionEnabled}
                      onCheckedChange={(value) => updateRule('attendance', 'absentDeductionEnabled', value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="half-day-threshold">Half Day Threshold (Hours)</Label>
                    <Input
                      id="half-day-threshold"
                      type="number"
                      value={rules.attendance.halfDayThreshold}
                      onChange={(e) => updateRule('attendance', 'halfDayThreshold', parseInt(e.target.value))}
                    />
                    <p className="text-xs text-gray-500 mt-1">Hours below which it's considered half day</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statutory">
          <Card>
            <CardHeader>
              <CardTitle>Statutory Deductions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Provident Fund (PF)</h3>
                  <div className="flex items-center justify-between">
                    <Label>Enable PF Deduction</Label>
                    <Switch
                      checked={rules.statutory.pfEnabled}
                      onCheckedChange={(value) => updateRule('statutory', 'pfEnabled', value)}
                    />
                  </div>
                  {rules.statutory.pfEnabled && (
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="pf-rate">PF Rate (%)</Label>
                        <Input
                          id="pf-rate"
                          type="number"
                          step="0.1"
                          value={rules.statutory.pfRate}
                          onChange={(e) => updateRule('statutory', 'pfRate', parseFloat(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="pf-ceiling">PF Ceiling (₹)</Label>
                        <Input
                          id="pf-ceiling"
                          type="number"
                          value={rules.statutory.pfCeiling}
                          onChange={(e) => updateRule('statutory', 'pfCeiling', parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Employee State Insurance (ESI)</h3>
                  <div className="flex items-center justify-between">
                    <Label>Enable ESI Deduction</Label>
                    <Switch
                      checked={rules.statutory.esiEnabled}
                      onCheckedChange={(value) => updateRule('statutory', 'esiEnabled', value)}
                    />
                  </div>
                  {rules.statutory.esiEnabled && (
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="esi-employee-rate">Employee ESI Rate (%)</Label>
                        <Input
                          id="esi-employee-rate"
                          type="number"
                          step="0.01"
                          value={rules.statutory.esiEmployeeRate}
                          onChange={(e) => updateRule('statutory', 'esiEmployeeRate', parseFloat(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="esi-ceiling">ESI Ceiling (₹)</Label>
                        <Input
                          id="esi-ceiling"
                          type="number"
                          value={rules.statutory.esiCeiling}
                          onChange={(e) => updateRule('statutory', 'esiCeiling', parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Professional Tax</Label>
                    <p className="text-sm text-gray-600">State-wise professional tax deduction</p>
                  </div>
                  <Switch
                    checked={rules.statutory.professionalTaxEnabled}
                    onCheckedChange={(value) => updateRule('statutory', 'professionalTaxEnabled', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Tax Deducted at Source (TDS)</Label>
                    <p className="text-sm text-gray-600">Income tax deduction</p>
                  </div>
                  <Switch
                    checked={rules.statutory.tdsEnabled}
                    onCheckedChange={(value) => updateRule('statutory', 'tdsEnabled', value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave">
          <Card>
            <CardHeader>
              <CardTitle>Leave Policy Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Unpaid Leave Deduction</Label>
                      <p className="text-sm text-gray-600">Deduct salary for unpaid leave days</p>
                    </div>
                    <Switch
                      checked={rules.leave.unpaidLeaveDeduction}
                      onCheckedChange={(value) => updateRule('leave', 'unpaidLeaveDeduction', value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Leave Encashment</Label>
                      <p className="text-sm text-gray-600">Allow unused leave encashment</p>
                    </div>
                    <Switch
                      checked={rules.leave.leaveEncashmentEnabled}
                      onCheckedChange={(value) => updateRule('leave', 'leaveEncashmentEnabled', value)}
                    />
                  </div>
                  
                  {rules.leave.leaveEncashmentEnabled && (
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="encashment-rate">Encashment Rate (%)</Label>
                        <Input
                          id="encashment-rate"
                          type="number"
                          value={rules.leave.encashmentRate}
                          onChange={(e) => updateRule('leave', 'encashmentRate', parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="max-encashment-days">Max Encashment Days</Label>
                        <Input
                          id="max-encashment-days"
                          type="number"
                          value={rules.leave.maxEncashmentDays}
                          onChange={(e) => updateRule('leave', 'maxEncashmentDays', parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="salary">
          <Card>
            <CardHeader>
              <CardTitle>Salary Structure Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Structure Calculation</Label>
                  <p className="text-sm text-gray-600">Automatically calculate salary components</p>
                </div>
                <Switch
                  checked={rules.salary.autoStructureCalculation}
                  onCheckedChange={(value) => updateRule('salary', 'autoStructureCalculation', value)}
                />
              </div>

              {rules.salary.autoStructureCalculation && (
                <>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="basic-percentage">Basic Salary (%)</Label>
                      <Input
                        id="basic-percentage"
                        type="number"
                        value={rules.salary.basicSalaryPercentage}
                        onChange={(e) => updateRule('salary', 'basicSalaryPercentage', parseInt(e.target.value))}
                      />
                      <p className="text-xs text-gray-500 mt-1">% of CTC</p>
                    </div>
                    <div>
                      <Label htmlFor="hra-percentage">HRA (%)</Label>
                      <Input
                        id="hra-percentage"
                        type="number"
                        value={rules.salary.hraPercentage}
                        onChange={(e) => updateRule('salary', 'hraPercentage', parseInt(e.target.value))}
                      />
                      <p className="text-xs text-gray-500 mt-1">% of Basic</p>
                    </div>
                    <div>
                      <Label htmlFor="da-percentage">DA (%)</Label>
                      <Input
                        id="da-percentage"
                        type="number"
                        value={rules.salary.daPercentage}
                        onChange={(e) => updateRule('salary', 'daPercentage', parseInt(e.target.value))}
                      />
                      <p className="text-xs text-gray-500 mt-1">% of Basic</p>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="payroll-cycle">Payroll Cycle</Label>
                  <Select
                    value={rules.salary.payrollCycle}
                    onValueChange={(value: 'monthly' | 'biweekly' | 'weekly') => updateRule('salary', 'payrollCycle', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="processing-day">Processing Day</Label>
                  <Input
                    id="processing-day"
                    type="number"
                    min="1"
                    max="31"
                    value={rules.salary.payrollProcessingDay}
                    onChange={(e) => updateRule('salary', 'payrollProcessingDay', parseInt(e.target.value))}
                  />
                  <p className="text-xs text-gray-500 mt-1">Day of month to process payroll</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">Configuration Status</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={rules.overtime.enabled ? "default" : "secondary"}>
              Overtime: {rules.overtime.enabled ? "Enabled" : "Disabled"}
            </Badge>
            <Badge variant={rules.statutory.pfEnabled ? "default" : "secondary"}>
              PF: {rules.statutory.pfEnabled ? "Enabled" : "Disabled"}
            </Badge>
            <Badge variant={rules.statutory.esiEnabled ? "default" : "secondary"}>
              ESI: {rules.statutory.esiEnabled ? "Enabled" : "Disabled"}
            </Badge>
            <Badge variant={rules.leave.leaveEncashmentEnabled ? "default" : "secondary"}>
              Leave Encashment: {rules.leave.leaveEncashmentEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollConfiguration;
