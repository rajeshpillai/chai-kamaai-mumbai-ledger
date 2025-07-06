
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEmployeeContext, SalaryStructure } from "@/contexts/EmployeeContext";
import { toast } from "sonner";
import SalaryStructureForm from "./SalaryStructureForm";
import { useState } from "react";

const employeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[+]?[0-9\s-()]{10,15}$/, "Invalid phone number"),
  role: z.string().min(1, "Role is required"),
  department: z.string().min(1, "Department is required"),
  location: z.string().min(1, "Location is required"),
  salary: z.number().min(1000, "Salary must be at least ₹1,000"),
  joinDate: z.string().min(1, "Join date is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  employmentType: z.enum(["Full-time", "Part-time", "Contract"]),
  address: z.string().min(10, "Address must be at least 10 characters"),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format (e.g., ABCDE1234F)"),
  aadhaarNumber: z.string().regex(/^[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/, "Invalid Aadhaar format (e.g., 1234 5678 9012)"),
  pfAccount: z.string().min(1, "PF Account is required"),
  esiNumber: z.string().regex(/^[0-9]{10}$/, "ESI number must be 10 digits"),
  bankAccountNumber: z.string().min(10, "Bank account number must be at least 10 digits"),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format"),
  bankName: z.string().min(1, "Bank name is required"),
  state: z.string().min(1, "State is required"),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface AddEmployeeFormProps {
  onSuccess: () => void;
}

const AddEmployeeForm = ({ onSuccess }: AddEmployeeFormProps) => {
  const { addEmployee } = useEmployeeContext();
  const [salaryStructure, setSalaryStructure] = useState<SalaryStructure | null>(null);

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "",
      department: "",
      location: "",
      salary: 0,
      joinDate: "",
      dateOfBirth: "",
      employmentType: "Full-time",
      address: "",
      panNumber: "",
      aadhaarNumber: "",
      pfAccount: "",
      esiNumber: "",
      bankAccountNumber: "",
      ifscCode: "",
      bankName: "",
      state: "",
    },
  });

  const watchedSalary = form.watch("salary");

  const onSubmit = (data: EmployeeFormData) => {
    try {
      if (!salaryStructure) {
        toast.error("Please configure salary structure first.");
        return;
      }

      const employeeData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        department: data.department,
        location: data.location,
        salary: data.salary,
        salaryStructure: salaryStructure,
        joinDate: data.joinDate,
        dateOfBirth: data.dateOfBirth,
        employmentType: data.employmentType,
        address: data.address,
        panNumber: data.panNumber,
        aadhaarNumber: data.aadhaarNumber,
        pfAccount: data.pfAccount,
        esiNumber: data.esiNumber,
        bankAccountNumber: data.bankAccountNumber,
        ifscCode: data.ifscCode,
        bankName: data.bankName,
        state: data.state,
        status: "Active" as const,
      };
      
      addEmployee(employeeData);
      toast.success("Employee added successfully!");
      onSuccess();
    } catch (error) {
      toast.error("Failed to add employee. Please try again.");
    }
  };

  const locations = [
    "Bandra West", "Andheri East", "Powai", "Juhu", "Colaba", 
    "Lower Parel", "Malad West", "Thane", "Navi Mumbai"
  ];

  const roles = [
    "Store Manager", "Assistant Manager", "Barista", "Cashier", 
    "Kitchen Staff", "Supervisor", "Trainee", "Cleaning Staff"
  ];

  const departments = [
    "Operations", "Food & Beverage", "Customer Service", 
    "Food Preparation", "Administration", "Maintenance"
  ];

  const banks = [
    "State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", 
    "Kotak Mahindra Bank", "Yes Bank", "Bank of Baroda", "Canara Bank"
  ];

  const states = [
    "Maharashtra", "Karnataka", "West Bengal", "Tamil Nadu", 
    "Andhra Pradesh", "Telangana", "Gujarat", "Madhya Pradesh",
    "Rajasthan", "Uttar Pradesh", "Bihar", "Odisha", "Kerala"
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="employee@cafepay.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 98765 43210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter complete address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Job Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Job Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employment Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Salary (₹) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="25000" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="joinDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Joining Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Salary Structure */}
        {watchedSalary > 0 && (
          <SalaryStructureForm
            totalSalary={watchedSalary}
            onStructureChange={setSalaryStructure}
          />
        )}

        {/* Tax & Compliance Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Tax & Compliance Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="panNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PAN Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="ABCDE1234F" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aadhaarNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aadhaar Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="1234 5678 9012" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pfAccount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PF Account Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="MH/BOM/12345/678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="esiNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ESI Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="1001234567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Bank Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Bank Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bank" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {banks.map((bank) => (
                        <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ifscCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IFSC Code *</FormLabel>
                  <FormControl>
                    <Input placeholder="HDFC0001234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bankAccountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="12345678901234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" className="bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700">
            Add Employee
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddEmployeeForm;
