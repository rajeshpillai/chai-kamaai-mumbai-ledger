
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import AttendanceReports from "@/components/AttendanceReports";
import PayrollReports from "@/components/PayrollReports";
import { FileText, Users, Calculator, BarChart } from "lucide-react";

const Reports = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive reporting dashboard for payroll, attendance, and employee data</p>
        </div>

        <Tabs defaultValue="attendance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Attendance Reports
            </TabsTrigger>
            <TabsTrigger value="payroll" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Payroll Reports
            </TabsTrigger>
            <TabsTrigger value="employee" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Employee Reports
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Compliance Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendance">
            <AttendanceReports />
          </TabsContent>

          <TabsContent value="payroll">
            <PayrollReports />
          </TabsContent>

          <TabsContent value="employee">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Employee Reports</h3>
              <p className="text-gray-600">Employee summary reports coming soon...</p>
            </Card>
          </TabsContent>

          <TabsContent value="compliance">
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Statutory Reports</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">PF Returns</h4>
                    <p className="text-sm text-gray-600 mb-3">Monthly PF contribution reports</p>
                    <Button size="sm" variant="outline">Generate Report</Button>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium mb-2">ESI Returns</h4>
                    <p className="text-sm text-gray-600 mb-3">Employee State Insurance reports</p>
                    <Button size="sm" variant="outline">Generate Report</Button>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium mb-2">TDS Reports</h4>
                    <p className="text-sm text-gray-600 mb-3">Tax deduction at source reports</p>
                    <Button size="sm" variant="outline">Generate Report</Button>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium mb-2">PT Returns</h4>
                    <p className="text-sm text-gray-600 mb-3">Professional Tax monthly reports</p>
                    <Button size="sm" variant="outline">Generate Report</Button>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-medium mb-2">Form 16</h4>
                    <p className="text-sm text-gray-600 mb-3">Annual salary certificates</p>
                    <Button size="sm" variant="outline">Generate Form 16</Button>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Audit Reports</h4>
                    <p className="text-sm text-gray-600 mb-3">Compliance audit trails</p>
                    <Button size="sm" variant="outline">View Audit Trail</Button>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Export Options</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline">Export to Excel</Button>
                  <Button variant="outline">Export to PDF</Button>
                  <Button variant="outline">Send via Email</Button>
                  <Button variant="outline">Schedule Reports</Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
