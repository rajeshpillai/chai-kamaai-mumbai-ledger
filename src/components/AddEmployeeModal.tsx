
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddEmployeeForm from "./AddEmployeeForm";

interface AddEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddEmployeeModal = ({ open, onOpenChange }: AddEmployeeModalProps) => {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Add New Employee
          </DialogTitle>
        </DialogHeader>
        <AddEmployeeForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeModal;
