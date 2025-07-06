
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, TrendingUp, Users, DollarSign } from "lucide-react";
import { usePayrollContext } from "@/contexts/PayrollContext";
import { useEmployeeContext } from "@/contexts/EmployeeContext";

const PayrollReports = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [reportType, setReportType] = useState("monthly");
  
  const { payrollRecords } = usePayrollContext();
  const { employees } = useEmployeeContext();

  const years = [2023, 2024, 2025].map(year => ({ value: year.toString(), label: year.toString() }));
  
  const filteredRecords = payrollRecords.filter(record => record.year.toString() === selectedYear);

  // Monthly Summary Data
  const monthlyData = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const monthRecords = filteredRecords.filter(record => parseInt(record.month) === month);
    const totalPayroll = monthRecords.reduce((sum, record) => sum + record.netSalary, 0);
    const employeeCount = monthRecords.length;
    
    return {
      month: new Date(0, index).toLocaleString('default', { month: 'short' }),
      totalPayroll,
      employeeCount,
      avgSalary: employeeCount > 0 ? Math.round(totalPayroll / employeeCount) : 0
    };
  });

  // Department-wise breakdown
  const departmentData = employees.reduce((acc, employee) => {
    const employeeRecords = filteredRecords.filter(record => record.employeeId === employee.id);
    const totalPaid = employeeRecords.reduce((sum, record) => sum + record.netSalary, 0);
    
    const existing = acc.find(item => item.department === employee.department);
    if (existing) {
      existing.totalPaid += totalPaid;
      existing.employeeCount += 1;
    } else {
      acc.push({
        department: employee.department,
        totalPaid,
        employeeCount: 1
      });
    }
    return acc;
  }, [] as any[]);

  // Location-wise breakdown
  const locationData = employees.reduce((acc, employee) => {
    const employeeRecords = filteredRecords.filter(record => record.employeeId === employee.id);
    const totalPaid = employeeRecords.reduce((sum, record) => sum + record.netSalary, 0);
    
    const existing = acc.find(item => item.location === employee.location);
    if (existing) {
      existing.totalPaid += totalPaid;
      existing.employeeCount += 1;
    } else {
      acc.push({
        location: employee.location,
        totalPaid,
        employeeCount: 1
      });
    }
    return acc;
  }, [] as any[]);

  const totalYearlyPayroll = filteredRecords.reduce((sum, record) => sum + record.netSalary, 0);
  const totalDeductions = filteredRecords.reduce((sum, record) => 
    sum + Object.values(record.deductions).reduce((deductionSum: number, val: number) => deductionSum + val, 0), 0
  );

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Payroll Reports</h3>
        <div className="flex flex-col md:flex-row gap-4 items-end">
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
          
          <div>
            <label className="block text-sm font-medium mb-2">Report Type</label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select report" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly Summary</SelectItem>
                <SelectItem value="department">Department-wise</SelectItem>
                <SelectItem value="location">Location-wise</SelectItem>
                <SelectItem value="compliance">Compliance Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-600">₹{totalYearlyPayroll.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Payroll {selectedYear}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-600">{employees.length}</p>
              <p className="text-sm text-gray-600">Active Employees</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-purple-600">
                ₹{employees.length > 0 ? Math.round(totalYearlyPayroll / employees.length).toLocaleString() : 0}
              </p>
              <p className="text-sm text-gray-600">Avg. Annual Salary</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <DollarSign className="h-8 w-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-red-600">₹{totalDeductions.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Deductions</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Monthly Chart */}
      {reportType === "monthly" && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Payroll Trend - {selectedYear}</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Bar dataKey="totalPayroll" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Department-wise Report */}
      {reportType === "department" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Department-wise Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    dataKey="totalPaid"
                    nameKey="department"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ department, totalPaid }) => `${department}: ₹${totalPaid.toLocaleString()}`}
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Department Summary</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Total Paid</TableHead>
                  <TableHead>Avg. Salary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departmentData.map((dept) => (
                  <TableRow key={dept.department}>
                    <TableCell className="font-medium">{dept.department}</TableCell>
                    <TableCell>{dept.employeeCount}</TableCell>
                    <TableCell>₹{dept.totalPaid.toLocaleString()}</TableCell>
                    <TableCell>₹{Math.round(dept.totalPaid / dept.employeeCount).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* Location-wise Report */}
      {reportType === "location" && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Location-wise Payroll Summary</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>Total Payroll</TableHead>
                <TableHead>Average Salary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locationData.map((location) => (
                <TableRow key={location.location}>
                  <TableCell className="font-medium">{location.location}</TableCell>
                  <TableCell>{location.employeeCount}</TableCell>
                  <TableCell>₹{location.totalPaid.toLocaleString()}</TableCell>
                  <TableCell>₹{Math.round(location.totalPaid / location.employeeCount).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Compliance Report */}
      {reportType === "compliance" && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Compliance Summary - {selectedYear}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">PF Contributions</h4>
              <p className="text-2xl font-bold text-blue-600">
                ₹{filteredRecords.reduce((sum, record) => sum + record.deductions.pf, 0).toLocaleString()}
              </p>
              <p className="text-sm text-blue-600">Total PF deducted</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">ESI Contributions</h4>
              <p className="text-2xl font-bold text-green-600">
                ₹{filteredRecords.reduce((sum, record) => sum + record.deductions.esi, 0).toLocaleString()}
              </p>
              <p className="text-sm text-green-600">Total ESI deducted</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2">TDS Deductions</h4>
              <p className="text-2xl font-bold text-purple-600">
                ₹{filteredRecords.reduce((sum, record) => sum + record.deductions.tds, 0).toLocaleString()}
              </p>
              <p className="text-sm text-purple-600">Total TDS deducted</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PayrollReports;
