import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useComplianceContext } from "@/contexts/ComplianceContext";
import { useToast } from "@/hooks/use-toast";
import { Building, Save, Settings } from "lucide-react";

const ComplianceConfiguration = () => {
  const { companyConfig, updateCompanyConfig } = useComplianceContext();
  const { toast } = useToast();
  const [formData, setFormData] = useState(companyConfig);

  const handleSave = () => {
    updateCompanyConfig(formData);
    toast({
      title: "Configuration Updated",
      description: "Company compliance configuration has been saved successfully.",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev] as Record<string, any>,
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Compliance Configuration</h2>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Configuration
        </Button>
      </div>

      {/* Company Information */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Building className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Company Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="address">Registered Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Registration Numbers */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Registration Numbers</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="panNumber">PAN Number</Label>
            <Input
              id="panNumber"
              value={formData.panNumber}
              onChange={(e) => handleInputChange('panNumber', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="tanNumber">TAN Number</Label>
            <Input
              id="tanNumber"
              value={formData.tanNumber}
              onChange={(e) => handleInputChange('tanNumber', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="pfRegistrationNumber">PF Registration Number</Label>
            <Input
              id="pfRegistrationNumber"
              value={formData.pfRegistrationNumber}
              onChange={(e) => handleInputChange('pfRegistrationNumber', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="esiRegistrationNumber">ESI Registration Number</Label>
            <Input
              id="esiRegistrationNumber"
              value={formData.esiRegistrationNumber}
              onChange={(e) => handleInputChange('esiRegistrationNumber', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="ptRegistrationNumber">PT Registration Number</Label>
            <Input
              id="ptRegistrationNumber"
              value={formData.ptRegistrationNumber}
              onChange={(e) => handleInputChange('ptRegistrationNumber', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="gstNumber">GST Number</Label>
            <Input
              id="gstNumber"
              value={formData.gstNumber}
              onChange={(e) => handleInputChange('gstNumber', e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Filing Schedules */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Filing Schedules</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tdsQuarterly">TDS Quarterly Filing</Label>
            <Input
              id="tdsQuarterly"
              value={formData.filingDates.tdsQuarterly}
              onChange={(e) => handleNestedInputChange('filingDates', 'tdsQuarterly', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="pfMonthly">PF Monthly Filing</Label>
            <Input
              id="pfMonthly"
              value={formData.filingDates.pfMonthly}
              onChange={(e) => handleNestedInputChange('filingDates', 'pfMonthly', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="esiMonthly">ESI Monthly Filing</Label>
            <Input
              id="esiMonthly"
              value={formData.filingDates.esiMonthly}
              onChange={(e) => handleNestedInputChange('filingDates', 'esiMonthly', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="ptMonthly">PT Monthly Filing</Label>
            <Input
              id="ptMonthly"
              value={formData.filingDates.ptMonthly}
              onChange={(e) => handleNestedInputChange('filingDates', 'ptMonthly', e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Compliance Officer */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Compliance Officer</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="officerName">Name</Label>
            <Input
              id="officerName"
              value={formData.complianceOfficer.name}
              onChange={(e) => handleNestedInputChange('complianceOfficer', 'name', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="officerEmail">Email</Label>
            <Input
              id="officerEmail"
              type="email"
              value={formData.complianceOfficer.email}
              onChange={(e) => handleNestedInputChange('complianceOfficer', 'email', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="officerPhone">Phone</Label>
            <Input
              id="officerPhone"
              value={formData.complianceOfficer.phone}
              onChange={(e) => handleNestedInputChange('complianceOfficer', 'phone', e.target.value)}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ComplianceConfiguration;