import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calculator, Download, Play, Eye } from "lucide-react";
import { usePayrollContext } from "@/contexts/PayrollContext";
import { useEmployeeContext } from "@/contexts/EmployeeContext";

const PayrollProcessing = () => {
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [previewMode, setPreviewMode] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  
  const { processPayroll, calculatePayroll, payrollRecords } = usePayrollContext();
  const { employees } = useEmployeeContext();

  const months = [
    { value: "1", label: "January" }, { value: "2", label: "February" }, { value: "3", label: "March" },
    { value: "4", label: "April" }, { value: "5", label: "May" }, { value: "6", label: "June" },
    { value: "7", label: "July" }, { value: "8", label: "August" }, { value: "9", label: "September" },
    { value: "10", label: "October" }, { value: "11", label: "November" }, { value: "12", label: "December" }
  ];

  const years = [2023, 2024, 2025].map(year => ({ value: year.toString(), label: year.toString() }));

  const handlePreviewCalculation = () => {
    const preview = employees.map(employee => 
      calculatePayroll(employee.id, selectedMonth, parseInt(selectedYear))
    );
    setPreviewData(preview);
    setPreviewMode(true);
  };

  const handleProcessPayroll = () => {
    processPayroll(selectedMonth, parseInt(selectedYear));
    setPreviewMode(false);
    setPreviewData([]);
  };

  const existingPayroll = payrollRecords.filter(p => 
    p.month === selectedMonth && p.year === parseInt(selectedYear)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processed": return "bg-green-100 text-green-800";
      case "Paid": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const calculateTotalDeductions = (deductions: any) => {
    if (!deductions) return 0;
    
    const safeNumber = (value: any): number => {
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    };

    return safeNumber(deductions.pf) + 
           safeNumber(deductions.esi) + 
           safeNumber(deductions.professionalTax) + 
           safeNumber(deductions.tds) + 
           safeNumber(deductions.lateDeduction) + 
           safeNumber(deductions.absentDeduction) + 
           safeNumber(deductions.unpaidLeaveDeduction || 0);
  };

  const dataToShow = previewMode ? previewData : existingPayroll.map(p => ({
    ...p,
    employeeName: employees.find(e => e.id === p.employeeId)?.name || 'Unknown'
  }));

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Payroll Processing</h3>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Month</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Year</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handlePreviewCalculation}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview Calculation
            </Button>
            
            <Button 
              onClick={handleProcessPayroll}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              disabled={previewMode && previewData.length === 0}
            >
              <Play className="h-4 w-4" />
              Process Payroll
            </Button>
          </div>
        </div>
      </Card>

      {/* Payroll Table */}
      {dataToShow.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">
              {previewMode ? 'Payroll Preview' : 'Processed Payroll'} - {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
            </h3>
            {!previewMode && (
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
          
          {previewMode && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-blue-800 text-sm">
                This is a preview of payroll calculations. Click "Process Payroll" to save these records.
              </p>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Basic Salary</TableHead>
                  <TableHead>Gross Salary</TableHead>
                  <TableHead>Total Deductions</TableHead>
                  <TableHead>Net Salary</TableHead>
                  {!previewMode && <TableHead>Status</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataToShow.map((record) => {
                  const employee = employees.find(e => e.id === record.employeeId);
                  const totalDeductions = calculateTotalDeductions(record.deductions);
                  
                  return (
                    <TableRow key={record.employeeId}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {employee?.avatar}
                          </div>
                          <div>
                            <p className="font-medium">{employee?.name}</p>
                            <p className="text-sm text-gray-600">{employee?.role}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>₹{(record.salaryBreakdown?.basic || record.basicSalary || 0).toLocaleString()}</TableCell>
                      <TableCell>₹{(record.grossSalary || 0).toLocaleString()}</TableCell>
                      <TableCell>₹{totalDeductions.toLocaleString()}</TableCell>
                      <TableCell className="font-semibold">₹{(record.netSalary || 0).toLocaleString()}</TableCell>
                      {!previewMode && (
                        <TableCell>
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PayrollProcessing;
