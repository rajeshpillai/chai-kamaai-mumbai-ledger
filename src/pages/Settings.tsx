import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Navbar from "@/components/Navbar";
import { Building, Calculator, Shield, User, Save, Plus, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserRole {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'HR Manager' | 'Location Manager';
  location?: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

const Settings = () => {
  const { toast } = useToast();
  const [companySettings, setCompanySettings] = useState({
    name: "Mumbai Cafe Chain",
    address: "123 Business District, Mumbai",
    pfNumber: "MH/123456",
    esiNumber: "12345678901",
    panNumber: "ABCDE1234F",
    tanNumber: "MUMM12345E"
  });

  const [salarySettings, setSalarySettings] = useState({
    basicPercentage: 40,
    hraPercentage: 40,
    daPercentage: 10,
    specialAllowancePercentage: 10,
    autoCalculate: true
  });

  const [complianceSettings, setComplianceSettings] = useState({
    pfRate: 12,
    esiEmployeeRate: 0.75,
    esiEmployerRate: 3.25,
    professionalTaxMaharashtra: 200,
    tdsThreshold: 300000,
    autoTaxCalculation: true,
    complianceAlerts: true,
    monthlyReportGeneration: true
  });

  const [users, setUsers] = useState<UserRole[]>([
    {
      id: "1",
      name: "Admin User",
      email: "admin@cafepayroll.com",
      role: "Super Admin",
      status: "Active",
      lastLogin: "2024-01-06"
    },
    {
      id: "2",
      name: "HR Manager",
      email: "hr@cafepayroll.com",
      role: "HR Manager",
      status: "Active",
      lastLogin: "2024-01-05"
    },
    {
      id: "3",
      name: "Bandra Manager",
      email: "bandra@cafepayroll.com",
      role: "Location Manager",
      location: "Bandra West Cafe",
      status: "Active",
      lastLogin: "2024-01-04"
    }
  ]);

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };

  const handleSaveCompliance = () => {
    toast({
      title: "Compliance Settings Saved",
      description: "Tax rates and compliance settings have been updated.",
    });
  };

  const handleAddUser = () => {
    toast({
      title: "Add User",
      description: "User management functionality coming soon.",
    });
  };

  const handleEditUser = (userId: string) => {
    toast({
      title: "Edit User",
      description: `Edit functionality for user ${userId} coming soon.`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "User Deleted",
      description: "User has been removed from the system.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage company settings, salary structures, and system preferences</p>
        </div>

        <Tabs defaultValue="company" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Company
            </TabsTrigger>
            <TabsTrigger value="salary" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Salary Structure
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Compliance
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6">Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input 
                    id="companyName"
                    value={companySettings.name}
                    onChange={(e) => setCompanySettings({...companySettings, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address"
                    value={companySettings.address}
                    onChange={(e) => setCompanySettings({...companySettings, address: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pfNumber">PF Registration Number</Label>
                  <Input 
                    id="pfNumber"
                    value={companySettings.pfNumber}
                    onChange={(e) => setCompanySettings({...companySettings, pfNumber: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="esiNumber">ESI Registration Number</Label>
                  <Input 
                    id="esiNumber"
                    value={companySettings.esiNumber}
                    onChange={(e) => setCompanySettings({...companySettings, esiNumber: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="panNumber">PAN Number</Label>
                  <Input 
                    id="panNumber"
                    value={companySettings.panNumber}
                    onChange={(e) => setCompanySettings({...companySettings, panNumber: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tanNumber">TAN Number</Label>
                  <Input 
                    id="tanNumber"
                    value={companySettings.tanNumber}
                    onChange={(e) => setCompanySettings({...companySettings, tanNumber: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={handleSaveSettings} className="mt-6">
                <Save className="h-4 w-4 mr-2" />
                Save Company Settings
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="salary">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6">Default Salary Structure</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-Calculate Salary Components</Label>
                    <p className="text-sm text-gray-600">Automatically calculate Basic, HRA, DA based on percentages</p>
                  </div>
                  <Switch 
                    checked={salarySettings.autoCalculate}
                    onCheckedChange={(checked) => setSalarySettings({...salarySettings, autoCalculate: checked})}
                  />
                </div>
                
                {salarySettings.autoCalculate && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <div className="space-y-2">
                      <Label>Basic Salary (%)</Label>
                      <Input 
                        type="number"
                        value={salarySettings.basicPercentage}
                        onChange={(e) => setSalarySettings({...salarySettings, basicPercentage: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>HRA (%)</Label>
                      <Input 
                        type="number"
                        value={salarySettings.hraPercentage}
                        onChange={(e) => setSalarySettings({...salarySettings, hraPercentage: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>DA (%)</Label>
                      <Input 
                        type="number"
                        value={salarySettings.daPercentage}
                        onChange={(e) => setSalarySettings({...salarySettings, daPercentage: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Special Allowance (%)</Label>
                      <Input 
                        type="number"
                        value={salarySettings.specialAllowancePercentage}
                        onChange={(e) => setSalarySettings({...salarySettings, specialAllowancePercentage: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                )}
              </div>
              <Button onClick={handleSaveSettings} className="mt-6">
                <Save className="h-4 w-4 mr-2" />
                Save Salary Settings
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="compliance">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6">Compliance Settings</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>PF Rate (%)</Label>
                    <Input 
                      type="number"
                      value={complianceSettings.pfRate}
                      onChange={(e) => setComplianceSettings({...complianceSettings, pfRate: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ESI Employee Rate (%)</Label>
                    <Input 
                      type="number"
                      step="0.01"
                      value={complianceSettings.esiEmployeeRate}
                      onChange={(e) => setComplianceSettings({...complianceSettings, esiEmployeeRate: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ESI Employer Rate (%)</Label>
                    <Input 
                      type="number"
                      step="0.01"
                      value={complianceSettings.esiEmployerRate}
                      onChange={(e) => setComplianceSettings({...complianceSettings, esiEmployerRate: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Professional Tax (Maharashtra)</Label>
                    <Input 
                      type="number"
                      value={complianceSettings.professionalTaxMaharashtra}
                      onChange={(e) => setComplianceSettings({...complianceSettings, professionalTaxMaharashtra: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>TDS Threshold (Annual)</Label>
                    <Input 
                      type="number"
                      value={complianceSettings.tdsThreshold}
                      onChange={(e) => setComplianceSettings({...complianceSettings, tdsThreshold: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto Tax Calculation</Label>
                      <p className="text-sm text-gray-600">Automatically calculate taxes based on current rates</p>
                    </div>
                    <Switch 
                      checked={complianceSettings.autoTaxCalculation}
                      onCheckedChange={(checked) => setComplianceSettings({...complianceSettings, autoTaxCalculation: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Compliance Alerts</Label>
                      <p className="text-sm text-gray-600">Receive notifications for compliance deadlines</p>
                    </div>
                    <Switch 
                      checked={complianceSettings.complianceAlerts}
                      onCheckedChange={(checked) => setComplianceSettings({...complianceSettings, complianceAlerts: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Monthly Report Generation</Label>
                      <p className="text-sm text-gray-600">Auto-generate monthly compliance reports</p>
                    </div>
                    <Switch 
                      checked={complianceSettings.monthlyReportGeneration}
                      onCheckedChange={(checked) => setComplianceSettings({...complianceSettings, monthlyReportGeneration: checked})}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveCompliance} className="mt-6">
                <Save className="h-4 w-4 mr-2" />
                Save Compliance Settings
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">User Management</h3>
                <Button onClick={handleAddUser}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
              
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{user.role}</p>
                        {user.location && <p className="text-xs text-gray-600">{user.location}</p>}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                        <p className="text-xs text-gray-500">Last: {user.lastLogin}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditUser(user.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
