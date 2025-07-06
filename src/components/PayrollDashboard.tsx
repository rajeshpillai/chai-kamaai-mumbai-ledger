
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, AlertTriangle, CheckCircle, Calendar, TrendingUp } from "lucide-react";
import { usePayrollContext } from "@/contexts/PayrollContext";
import { useEmployeeContext } from "@/contexts/EmployeeContext";

const PayrollDashboard = () => {
  const { getCurrentMonthPayroll, processPayroll } = usePayrollContext();
  const { employees } = useEmployeeContext();
  
  const currentPayroll = getCurrentMonthPayroll();
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();
  
  const totalEmployees = employees.length;
  const processedCount = currentPayroll.filter(p => p.status === 'Processed').length;
  const pendingCount = totalEmployees - processedCount;
  const totalPayroll = currentPayroll.reduce((sum, p) => sum + p.netSalary, 0);
  
  const handleProcessPayroll = () => {
    processPayroll((new Date().getMonth() + 1).toString(), currentYear);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{totalEmployees}</p>
          <p className="text-sm text-gray-600">Total Employees</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">{processedCount}</p>
          <p className="text-sm text-gray-600">Processed</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
          <p className="text-sm text-gray-600">Pending</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-600">₹{totalPayroll.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Total Payroll</p>
        </Card>
      </div>

      {/* Current Month Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-semibold">Payroll Status - {currentMonth} {currentYear}</h3>
          </div>
          <Badge className={pendingCount > 0 ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"}>
            {pendingCount > 0 ? `${pendingCount} Pending` : "All Processed"}
          </Badge>
        </div>
        
        <div className="space-y-4">
          {pendingCount > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-orange-800">Action Required</h4>
                  <p className="text-sm text-orange-600">
                    {pendingCount} employee(s) payroll needs to be processed for {currentMonth}
                  </p>
                </div>
                <Button 
                  onClick={handleProcessPayroll}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Process All Payroll
                </Button>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-medium">Avg. Salary</span>
              </div>
              <p className="text-lg font-bold text-gray-800">
                ₹{currentPayroll.length > 0 ? Math.round(totalPayroll / currentPayroll.length).toLocaleString() : 0}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Total Deductions</span>
              </div>
              <p className="text-lg font-bold text-gray-800">
                ₹{currentPayroll.reduce((sum, p) => sum + Object.values(p.deductions).reduce((a, b) => a + b, 0), 0).toLocaleString()}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Processing Rate</span>
              </div>
              <p className="text-lg font-bold text-gray-800">
                {totalEmployees > 0 ? Math.round((processedCount / totalEmployees) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PayrollDashboard;
