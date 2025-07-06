
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, User } from "lucide-react";
import { usePayrollContext } from "@/contexts/PayrollContext";
import { useEmployeeContext } from "@/contexts/EmployeeContext";

const SalarySlips = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  
  const { payrollRecords } = usePayrollContext();
  const { employees } = useEmployeeContext();

  const months = [
    { value: "1", label: "January" }, { value: "2", label: "February" }, { value: "3", label: "March" },
    { value: "4", label: "April" }, { value: "5", label: "May" }, { value: "6", label: "June" },
    { value: "7", label: "July" }, { value: "8", label: "August" }, { value: "9", label: "September" },
    { value: "10", label: "October" }, { value: "11", label: "November" }, { value: "12", label: "December" }
  ];

  const years = [2023, 2024, 2025].map(year => ({ value: year.toString(), label: year.toString() }));

  const filteredRecords = payrollRecords.filter(record => {
    const matchesEmployee = !selectedEmployee || record.employeeId.toString() === selectedEmployee;
    const matchesMonth = record.month === selectedMonth;
    const matchesYear = record.year.toString() === selectedYear;
    return matchesEmployee && matchesMonth && matchesYear;
  });

  const SalarySlipCard = ({ record }: { record: any }) => {
    const employee = employees.find(e => e.id === record.employeeId);
    const totalDeductions = Object.values(record.deductions).reduce((sum: number, val: number) => sum + val, 0);
    
    return (
      <Card className="p-6 space-y-4">
        {/* Header */}
        <div className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Salary Slip</h3>
              <p className="text-sm text-gray-600">
                {months.find(m => m.value === record.month)?.label} {record.year}
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800">
              {record.status}
            </Badge>
          </div>
        </div>

        {/* Employee Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Employee Details</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Name:</span> {employee?.name}</p>
              <p><span className="font-medium">ID:</span> {employee?.id}</p>
              <p><span className="font-medium">Role:</span> {employee?.role}</p>
              <p><span className="font-medium">Department:</span> {employee?.department}</p>
              <p><span className="font-medium">Location:</span> {employee?.location}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Payment Details</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Bank:</span> {employee?.bankName}</p>
              <p><span className="font-medium">Account:</span> ****{employee?.bankAccountNumber.slice(-4)}</p>
              <p><span className="font-medium">IFSC:</span> {employee?.ifscCode}</p>
              <p><span className="font-medium">PAN:</span> {employee?.panNumber}</p>
            </div>
          </div>
        </div>

        {/* Salary Breakdown */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-700">Salary Breakdown</h4>
          
          {/* Earnings */}
          <div className="bg-green-50 rounded-lg p-4">
            <h5 className="font-medium text-green-800 mb-2">Earnings</h5>
            <div className="flex justify-between items-center">
              <span>Basic Salary</span>
              <span className="font-medium">₹{record.basicSalary.toLocaleString()}</span>
            </div>
            {record.overtimePay > 0 && (
              <div className="flex justify-between items-center">
                <span>Overtime Pay</span>
                <span className="font-medium">₹{record.overtimePay.toLocaleString()}</span>
              </div>
            )}
            {record.bonuses > 0 && (
              <div className="flex justify-between items-center">
                <span>Bonuses</span>
                <span className="font-medium">₹{record.bonuses.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t mt-2 pt-2 flex justify-between items-center font-semibold">
              <span>Gross Salary</span>
              <span>₹{record.grossSalary.toLocaleString()}</span>
            </div>
          </div>

          {/* Deductions */}
          <div className="bg-red-50 rounded-lg p-4">
            <h5 className="font-medium text-red-800 mb-2">Deductions</h5>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span>Provident Fund (PF)</span>
                <span className="font-medium">₹{record.deductions.pf.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>ESI</span>
                <span className="font-medium">₹{record.deductions.esi.toLocaleString()}</span>
              </div>
              {record.deductions.tds > 0 && (
                <div className="flex justify-between items-center">
                  <span>TDS</span>
                  <span className="font-medium">₹{record.deductions.tds.toLocaleString()}</span>
                </div>
              )}
              {record.deductions.lateDeduction > 0 && (
                <div className="flex justify-between items-center">
                  <span>Late Deduction</span>
                  <span className="font-medium">₹{record.deductions.lateDeduction.toLocaleString()}</span>
                </div>
              )}
              {record.deductions.absentDeduction > 0 && (
                <div className="flex justify-between items-center">
                  <span>Absent Deduction</span>
                  <span className="font-medium">₹{record.deductions.absentDeduction.toLocaleString()}</span>
                </div>
              )}
            </div>
            <div className="border-t mt-2 pt-2 flex justify-between items-center font-semibold">
              <span>Total Deductions</span>
              <span>₹{totalDeductions.toLocaleString()}</span>
            </div>
          </div>

          {/* Net Salary */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex justify-between items-center text-lg font-bold text-blue-800">
              <span>Net Salary</span>
              <span>₹{record.netSalary.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Salary Slips</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Employee</label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger>
                <SelectValue placeholder="All employees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All employees</SelectItem>
                {employees.map(employee => (
                  <SelectItem key={employee.id} value={employee.id.toString()}>
                    {employee.name} - {employee.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
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
      </Card>

      {/* Salary Slips */}
      {filteredRecords.length > 0 ? (
        <div className="space-y-6">
          {filteredRecords.map(record => (
            <SalarySlipCard key={`${record.employeeId}-${record.month}-${record.year}`} record={record} />
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No salary slips found</h3>
            <p className="text-gray-600">
              No salary slips available for the selected criteria. Process payroll first to generate salary slips.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SalarySlips;
