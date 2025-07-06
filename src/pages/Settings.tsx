
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Navbar from "@/components/Navbar";
import { Building, Calculator, Shield, User, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
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
              <h3 className="text-xl font-semibold mb-4">Compliance Settings</h3>
              <p className="text-gray-600">Tax rates, professional tax, and compliance configurations coming soon...</p>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">User Management</h3>
              <p className="text-gray-600">User roles and access control settings coming soon...</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
