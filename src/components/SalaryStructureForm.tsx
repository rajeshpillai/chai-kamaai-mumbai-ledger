
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SalaryStructure } from "@/contexts/EmployeeContext";
import { useState, useEffect } from "react";

const salaryStructureSchema = z.object({
  basic: z.number().min(0, "Basic salary must be positive"),
  hra: z.number().min(0, "HRA must be positive"),
  da: z.number().min(0, "DA must be positive"),
  specialAllowance: z.number().min(0, "Special allowance must be positive"),
  medicalAllowance: z.number().min(0, "Medical allowance must be positive"),
  conveyanceAllowance: z.number().min(0, "Conveyance allowance must be positive"),
  otherAllowances: z.number().min(0, "Other allowances must be positive"),
});

type SalaryStructureFormData = z.infer<typeof salaryStructureSchema>;

interface SalaryStructureFormProps {
  initialStructure?: SalaryStructure;
  onStructureChange: (structure: SalaryStructure) => void;
  totalSalary: number;
}

const SalaryStructureForm = ({
  initialStructure,
  onStructureChange,
  totalSalary,
}: SalaryStructureFormProps) => {
  const [isAutoCalculate, setIsAutoCalculate] = useState(true);

  const form = useForm<SalaryStructureFormData>({
    resolver: zodResolver(salaryStructureSchema),
    defaultValues: {
      basic: initialStructure?.basic || 0,
      hra: initialStructure?.hra || 0,
      da: initialStructure?.da || 0,
      specialAllowance: initialStructure?.specialAllowance || 0,
      medicalAllowance: initialStructure?.medicalAllowance || 1250,
      conveyanceAllowance: initialStructure?.conveyanceAllowance || 1600,
      otherAllowances: initialStructure?.otherAllowances || 0,
    },
  });

  const watchedValues = form.watch();

  // Auto-calculate salary structure based on industry standards
  const calculateAutoStructure = (ctc: number): SalaryStructure => {
    const basic = Math.round(ctc * 0.5);
    const hra = Math.round(basic * 0.4);
    const da = Math.round(basic * 0.12);
    const specialAllowance = Math.round(ctc * 0.15);
    const medicalAllowance = 1250;
    const conveyanceAllowance = 1600;
    const otherAllowances = Math.max(0, ctc - (basic + hra + da + specialAllowance + medicalAllowance + conveyanceAllowance));

    return {
      basic,
      hra,
      da,
      specialAllowance,
      medicalAllowance,
      conveyanceAllowance,
      otherAllowances,
      ctc
    };
  };

  useEffect(() => {
    if (isAutoCalculate && totalSalary > 0) {
      const autoStructure = calculateAutoStructure(totalSalary * 12); // Convert monthly to annual
      form.reset({
        basic: Math.round(autoStructure.basic / 12),
        hra: Math.round(autoStructure.hra / 12),
        da: Math.round(autoStructure.da / 12),
        specialAllowance: Math.round(autoStructure.specialAllowance / 12),
        medicalAllowance: Math.round(autoStructure.medicalAllowance / 12),
        conveyanceAllowance: Math.round(autoStructure.conveyanceAllowance / 12),
        otherAllowances: Math.round(autoStructure.otherAllowances / 12),
      });
      onStructureChange(autoStructure);
    }
  }, [isAutoCalculate, totalSalary, form, onStructureChange]);

  useEffect(() => {
    if (!isAutoCalculate) {
      const monthlyTotal = Object.values(watchedValues).reduce((sum, val) => sum + (val || 0), 0);
      const annualStructure: SalaryStructure = {
        basic: (watchedValues.basic || 0) * 12,
        hra: (watchedValues.hra || 0) * 12,
        da: (watchedValues.da || 0) * 12,
        specialAllowance: (watchedValues.specialAllowance || 0) * 12,
        medicalAllowance: (watchedValues.medicalAllowance || 0) * 12,
        conveyanceAllowance: (watchedValues.conveyanceAllowance || 0) * 12,
        otherAllowances: (watchedValues.otherAllowances || 0) * 12,
        ctc: monthlyTotal * 12
      };
      onStructureChange(annualStructure);
    }
  }, [watchedValues, isAutoCalculate, onStructureChange]);

  const currentTotal = Object.values(watchedValues).reduce((sum, val) => sum + (val || 0), 0);
  const difference = totalSalary - currentTotal;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Salary Structure</h3>
          <p className="text-sm text-gray-600">Configure salary components</p>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="auto-calculate">Auto Calculate</Label>
          <Switch
            id="auto-calculate"
            checked={isAutoCalculate}
            onCheckedChange={setIsAutoCalculate}
          />
        </div>
      </div>

      {!isAutoCalculate && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total: ₹{currentTotal.toLocaleString()}</span>
            <span className={`text-sm font-medium ${difference === 0 ? 'text-green-600' : difference > 0 ? 'text-orange-600' : 'text-red-600'}`}>
              {difference === 0 ? '✓ Balanced' : `${difference > 0 ? 'Under' : 'Over'} by ₹${Math.abs(difference).toLocaleString()}`}
            </span>
          </div>
        </div>
      )}

      <Form {...form}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="basic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Basic Salary (Monthly) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled={isAutoCalculate}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    className={isAutoCalculate ? "bg-gray-100" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hra"
            render={({ field }) => (
              <FormItem>
                <FormLabel>House Rent Allowance (HRA) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled={isAutoCalculate}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    className={isAutoCalculate ? "bg-gray-100" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="da"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dearness Allowance (DA) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled={isAutoCalculate}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    className={isAutoCalculate ? "bg-gray-100" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specialAllowance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Allowance *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled={isAutoCalculate}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    className={isAutoCalculate ? "bg-gray-100" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="medicalAllowance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medical Allowance *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled={isAutoCalculate}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    className={isAutoCalculate ? "bg-gray-100" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="conveyanceAllowance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conveyance Allowance *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled={isAutoCalculate}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    className={isAutoCalculate ? "bg-gray-100" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="otherAllowances"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Other Allowances</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled={isAutoCalculate}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    className={isAutoCalculate ? "bg-gray-100" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>

      {isAutoCalculate && (
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-800">
            Salary structure is automatically calculated based on industry standards:
            <br />• Basic: 50% of CTC
            <br />• HRA: 40% of Basic
            <br />• DA: 12% of Basic
            <br />• Special Allowance: 15% of CTC
            <br />• Medical & Conveyance: Fixed amounts as per IT Act
          </p>
        </div>
      )}
    </div>
  );
};

export default SalaryStructureForm;
