
import { useToast, toast } from "@/hooks/use-toast";

// Enhanced toast utility with common patterns
export const showSuccessToast = (message: string, description?: string) => {
  toast({
    title: message,
    description,
    variant: "default",
  });
};

export const showErrorToast = (message: string, description?: string) => {
  toast({
    title: message,
    description,
    variant: "destructive",
  });
};

export const showWarningToast = (message: string, description?: string) => {
  toast({
    title: message,
    description,
  });
};

export { useToast, toast };
