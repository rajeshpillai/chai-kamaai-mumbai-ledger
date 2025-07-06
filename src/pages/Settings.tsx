
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import ShiftManagement from "@/components/ShiftManagement";
import EmployeeShiftAssignment from "@/components/EmployeeShiftAssignment";
import ShiftScheduling from "@/components/ShiftScheduling";
import LeaveManagement from "@/components/LeaveManagement";
import PayrollConfiguration from "@/components/PayrollConfiguration";
import { Settings as SettingsIcon, Clock, Users, Calendar, FileText, Plane } from "lucide-react";

const Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Settings & Administration</h1>
          <p className="text-gray-600">Manage system settings, shifts, leave management, and administrative configurations</p>
        </div>

        <Tabs defaultValue="shifts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="shifts" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Shift Setup
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Shift Assignments
            </TabsTrigger>
            <TabsTrigger value="scheduling" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Shift Scheduling
            </TabsTrigger>
            <TabsTrigger value="leave" className="flex items-center gap-2">
              <Plane className="h-4 w-4" />
              Leave Management
            </TabsTrigger>
            <TabsTrigger value="payroll" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Payroll Rules
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              System Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shifts">
            <ShiftManagement />
          </TabsContent>

          <TabsContent value="assignments">
            <EmployeeShiftAssignment />
          </TabsContent>

          <TabsContent value="scheduling">
            <ShiftScheduling />
          </TabsContent>

          <TabsContent value="leave">
            <LeaveManagement />
          </TabsContent>

          <TabsContent value="payroll">
            <PayrollConfiguration />
          </TabsContent>

          <TabsContent value="system">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">System Configuration</h3>
              <p className="text-gray-600">General system settings, notifications, and preferences.</p>
              <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-800">System settings component coming soon...</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
