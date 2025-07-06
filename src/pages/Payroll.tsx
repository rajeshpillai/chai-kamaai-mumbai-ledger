
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, FileText, Users, TrendingUp, DollarSign } from "lucide-react";
import Navbar from "@/components/Navbar";
import PayrollDashboard from "@/components/PayrollDashboard";
import PayrollProcessing from "@/components/PayrollProcessing";
import SalarySlips from "@/components/SalarySlips";
import PayrollReports from "@/components/PayrollReports";

const Payroll = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Payroll Management</h1>
            <p className="text-gray-600">Process salaries, generate slips, and manage payroll compliance</p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Quick Reports
            </Button>
            <Button className="bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700">
              <Calculator className="h-4 w-4 mr-2" />
              Process Payroll
            </Button>
          </div>
        </div>

        {/* Payroll Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="process" className="flex items-center space-x-2">
              <Calculator className="h-4 w-4" />
              <span>Process Payroll</span>
            </TabsTrigger>
            <TabsTrigger value="slips" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Salary Slips</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Reports</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <PayrollDashboard />
          </TabsContent>

          <TabsContent value="process">
            <PayrollProcessing />
          </TabsContent>

          <TabsContent value="slips">
            <SalarySlips />
          </TabsContent>

          <TabsContent value="reports">
            <PayrollReports />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Payroll;
