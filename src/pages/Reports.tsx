
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
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
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Compliance Reports</h3>
              <p className="text-gray-600">Compliance and regulatory reports coming soon...</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
