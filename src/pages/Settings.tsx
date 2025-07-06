
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import ShiftManagement from "@/components/ShiftManagement";
import { Settings as SettingsIcon, Clock, Users, Calendar, FileText } from "lucide-react";

const Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Settings & Administration</h1>
          <p className="text-gray-600">Manage system settings, shifts, and administrative configurations</p>
        </div>

        <Tabs defaultValue="shifts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="shifts" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Shift Management
            </TabsTrigger>
            <TabsTrigger value="leave" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Leave Settings
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

          <TabsContent value="leave">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Leave Management Settings</h3>
              <p className="text-gray-600">Configure leave policies, balances, and approval workflows.</p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">Leave management component coming soon...</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="payroll">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Payroll Rules & Configuration</h3>
              <p className="text-gray-600">Set up overtime rules, deductions, and payroll processing parameters.</p>
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">Payroll configuration component coming soon...</p>
              </div>
            </Card>
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
