
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditEmployeeForm from "./EditEmployeeForm";
import { Employee } from "@/contexts/EmployeeContext";

interface EditEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

const EditEmployeeModal = ({ open, onOpenChange, employee }: EditEmployeeModalProps) => {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Edit Employee: {employee.name}
          </DialogTitle>
        </DialogHeader>
        <EditEmployeeForm employee={employee} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployeeModal;
