import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Save, 
  Settings, 
  DollarSign, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Factory, 
  Coffee,
  ShoppingBag,
  Monitor,
  TrendingUp,
  Award,
  Gift,
  Target
} from 'lucide-react';
import { useWageConfiguration, VariablePayComponent, Industry, VariablePayType } from '@/contexts/WageConfigurationContext';
import { useToast } from '@/hooks/use-toast';

const WageConfiguration = () => {
  const { 
    configuration, 
    industryTemplates, 
    updateConfiguration,
    addVariablePayComponent,
    updateVariablePayComponent,
    removeVariablePayComponent,
    applyIndustryTemplate
  } = useWageConfiguration();
  const { toast } = useToast();
  
  const [isVarPayDialogOpen, setIsVarPayDialogOpen] = useState(false);
  const [editingVarPay, setEditingVarPay] = useState<VariablePayComponent | null>(null);
  const [varPayForm, setVarPayForm] = useState<{
    type: VariablePayType;
    name: string;
    description: string;
    calculationMethod: 'fixed' | 'percentage' | 'formula' | 'hours_based' | 'units_based';
    amount: number;
    percentage: number;
    taxable: boolean;
    includeInStatutory: boolean;
    active: boolean;
  }>({
    type: 'bonus',
    name: '',
    description: '',
    calculationMethod: 'fixed',
    amount: 0,
    percentage: 0,
    taxable: true,
    includeInStatutory: true,
    active: true
  });

  const handleSaveConfiguration = () => {
    toast({
      title: "Configuration Saved",
      description: "Wage configuration has been updated successfully.",
    });
  };

  const handleApplyTemplate = (industry: Industry) => {
    applyIndustryTemplate(industry);
    toast({
      title: "Template Applied",
      description: `${industry} industry template has been applied with default variable pay components.`,
    });
  };

  const handleSaveVarPay = () => {
    if (!varPayForm.name) {
      toast({
        title: "Validation Error",
        description: "Please enter a name for the variable pay component.",
        variant: "destructive",
      });
      return;
    }

    const component = {
      ...varPayForm,
      effectiveFrom: new Date().toISOString()
    };

    if (editingVarPay) {
      updateVariablePayComponent(editingVarPay.id, component);
      toast({
        title: "Component Updated",
        description: `${varPayForm.name} has been updated successfully.`,
      });
    } else {
      addVariablePayComponent(component);
      toast({
        title: "Component Added",
        description: `${varPayForm.name} has been added successfully.`,
      });
    }

    handleCloseVarPayDialog();
  };

  const handleEditVarPay = (component: VariablePayComponent) => {
    setEditingVarPay(component);
    setVarPayForm({
      type: component.type,
      name: component.name,
      description: component.description || '',
      calculationMethod: component.calculationMethod,
      amount: component.amount || 0,
      percentage: component.percentage || 0,
      taxable: component.taxable,
      includeInStatutory: component.includeInStatutory,
      active: component.active
    });
    setIsVarPayDialogOpen(true);
  };

  const handleCloseVarPayDialog = () => {
    setIsVarPayDialogOpen(false);
    setEditingVarPay(null);
    setVarPayForm({
      type: 'bonus',
      name: '',
      description: '',
      calculationMethod: 'fixed',
      amount: 0,
      percentage: 0,
      taxable: true,
      includeInStatutory: true,
      active: true
    });
  };

  const getIndustryIcon = (industry: Industry) => {
    switch (industry) {
      case 'IT': return <Monitor className="h-4 w-4" />;
      case 'Hospitality': return <Coffee className="h-4 w-4" />;
      case 'Manufacturing': return <Factory className="h-4 w-4" />;
      case 'Retail': return <ShoppingBag className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getVarPayIcon = (type: string) => {
    switch (type) {
      case 'bonus': return <Award className="h-4 w-4" />;
      case 'commission': return <TrendingUp className="h-4 w-4" />;
      case 'tips': return <Gift className="h-4 w-4" />;
      case 'incentive': return <Target className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Wage & Variable Pay Configuration</h2>
          <p className="text-muted-foreground">Configure industry-specific wage structures and variable pay components</p>
        </div>
        <Button onClick={handleSaveConfiguration} className="bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4 mr-2" />
          Save Configuration
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="templates">Industry Templates</TabsTrigger>
          <TabsTrigger value="variable-pay">Variable Pay</TabsTrigger>
          <TabsTrigger value="rates">Wage Rates</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Industry Type</Label>
                    <Select 
                      value={configuration.industry} 
                      onValueChange={(value: Industry) => updateConfiguration({ industry: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IT">Information Technology</SelectItem>
                        <SelectItem value="Hospitality">Hospitality & Food Service</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing & Production</SelectItem>
                        <SelectItem value="Retail">Retail & Sales</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Default Pay Type</Label>
                    <Select 
                      value={configuration.defaultPayType} 
                      onValueChange={(value) => updateConfiguration({ defaultPayType: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Monthly">Monthly Salary</SelectItem>
                        <SelectItem value="Hourly">Hourly Wage</SelectItem>
                        <SelectItem value="Daily">Daily Wage</SelectItem>
                        <SelectItem value="Piece-rate">Piece Rate</SelectItem>
                        <SelectItem value="Commission">Commission Based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Variable Pay</Label>
                      <p className="text-sm text-muted-foreground">Allow bonuses, commissions, and other variable pay</p>
                    </div>
                    <Switch
                      checked={configuration.variablePayEnabled}
                      onCheckedChange={(value) => updateConfiguration({ variablePayEnabled: value })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Approval</Label>
                      <p className="text-sm text-muted-foreground">Variable pay requires manager approval</p>
                    </div>
                    <Switch
                      checked={configuration.approvalRequired}
                      onCheckedChange={(value) => updateConfiguration({ approvalRequired: value })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-4">Minimum Wage Rates</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="min-hourly">Minimum Hourly Rate (₹)</Label>
                    <Input
                      id="min-hourly"
                      type="number"
                      value={configuration.minimumWage.hourly}
                      onChange={(e) => updateConfiguration({
                        minimumWage: { 
                          ...configuration.minimumWage, 
                          hourly: parseInt(e.target.value) 
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="min-daily">Minimum Daily Rate (₹)</Label>
                    <Input
                      id="min-daily"
                      type="number"
                      value={configuration.minimumWage.daily}
                      onChange={(e) => updateConfiguration({
                        minimumWage: { 
                          ...configuration.minimumWage, 
                          daily: parseInt(e.target.value) 
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="min-monthly">Minimum Monthly Salary (₹)</Label>
                    <Input
                      id="min-monthly"
                      type="number"
                      value={configuration.minimumWage.monthly}
                      onChange={(e) => updateConfiguration({
                        minimumWage: { 
                          ...configuration.minimumWage, 
                          monthly: parseInt(e.target.value) 
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Industry Templates</CardTitle>
              <p className="text-muted-foreground">Quick setup with pre-configured industry-specific settings</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {industryTemplates.map((template) => (
                  <Card key={template.name} className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      {getIndustryIcon(template.name)}
                      <h3 className="font-semibold">{template.displayName}</h3>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-muted-foreground">
                        Default Pay Type: <Badge variant="secondary">{template.defaultConfig.defaultPayType}</Badge>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Variable Pay Components: {template.commonVariablePayComponents.length}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Suggested Roles: {template.suggestedRoles.slice(0, 2).join(', ')}
                        {template.suggestedRoles.length > 2 && '...'}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleApplyTemplate(template.name)}
                    >
                      Apply Template
                    </Button>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variable-pay">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Variable Pay Components</CardTitle>
                <Button onClick={() => setIsVarPayDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Component
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Calculation</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Taxable</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {configuration.variablePayComponents.map((component) => (
                    <TableRow key={component.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getVarPayIcon(component.type)}
                          <div>
                            <div className="font-medium">{component.name}</div>
                            {component.description && (
                              <div className="text-sm text-muted-foreground">{component.description}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{component.type}</Badge>
                      </TableCell>
                      <TableCell>
                        {component.calculationMethod === 'fixed' && `₹${component.amount}`}
                        {component.calculationMethod === 'percentage' && `${component.percentage}%`}
                        {component.calculationMethod === 'formula' && 'Formula'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={component.active ? "default" : "secondary"}>
                          {component.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={component.taxable ? "destructive" : "secondary"}>
                          {component.taxable ? 'Taxable' : 'Non-taxable'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditVarPay(component)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => removeVariablePayComponent(component.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rates">
          <Card>
            <CardHeader>
              <CardTitle>Department Wage Rates</CardTitle>
              <p className="text-muted-foreground">Configure hourly rates for different departments and shift types</p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Department wage rate configuration will be available here.</p>
                <p className="text-sm">Configure base rates, overtime rates, and shift differentials by department.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isVarPayDialogOpen} onOpenChange={handleCloseVarPayDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingVarPay ? 'Edit Variable Pay Component' : 'Add Variable Pay Component'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Component Type</Label>
                <Select 
                  value={varPayForm.type} 
                  onValueChange={(value) => setVarPayForm({ ...varPayForm, type: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bonus">Performance Bonus</SelectItem>
                    <SelectItem value="commission">Sales Commission</SelectItem>
                    <SelectItem value="tips">Tips & Gratuities</SelectItem>
                    <SelectItem value="incentive">Incentive</SelectItem>
                    <SelectItem value="premium">Shift Premium</SelectItem>
                    <SelectItem value="allowance">Allowance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Calculation Method</Label>
                <Select 
                  value={varPayForm.calculationMethod} 
                  onValueChange={(value) => setVarPayForm({ ...varPayForm, calculationMethod: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="formula">Custom Formula</SelectItem>
                    <SelectItem value="hours_based">Hours Based</SelectItem>
                    <SelectItem value="units_based">Units Based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="var-pay-name">Component Name</Label>
              <Input
                id="var-pay-name"
                value={varPayForm.name}
                onChange={(e) => setVarPayForm({ ...varPayForm, name: e.target.value })}
                placeholder="Enter component name"
              />
            </div>

            <div>
              <Label htmlFor="var-pay-desc">Description (Optional)</Label>
              <Input
                id="var-pay-desc"
                value={varPayForm.description}
                onChange={(e) => setVarPayForm({ ...varPayForm, description: e.target.value })}
                placeholder="Enter description"
              />
            </div>

            {varPayForm.calculationMethod === 'fixed' && (
              <div>
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={varPayForm.amount}
                  onChange={(e) => setVarPayForm({ ...varPayForm, amount: parseInt(e.target.value) })}
                />
              </div>
            )}

            {varPayForm.calculationMethod === 'percentage' && (
              <div>
                <Label htmlFor="percentage">Percentage (%)</Label>
                <Input
                  id="percentage"
                  type="number"
                  step="0.1"
                  value={varPayForm.percentage}
                  onChange={(e) => setVarPayForm({ ...varPayForm, percentage: parseFloat(e.target.value) })}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label>Taxable</Label>
                <Switch
                  checked={varPayForm.taxable}
                  onCheckedChange={(value) => setVarPayForm({ ...varPayForm, taxable: value })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Include in Statutory</Label>
                <Switch
                  checked={varPayForm.includeInStatutory}
                  onCheckedChange={(value) => setVarPayForm({ ...varPayForm, includeInStatutory: value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch
                checked={varPayForm.active}
                onCheckedChange={(value) => setVarPayForm({ ...varPayForm, active: value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseVarPayDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveVarPay}>
              {editingVarPay ? 'Update Component' : 'Add Component'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WageConfiguration;