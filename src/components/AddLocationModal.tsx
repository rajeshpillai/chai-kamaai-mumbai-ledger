
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocationContext } from "@/contexts/LocationContext";
import { useToast } from "@/hooks/use-toast";
import LocationForm from "./LocationForm";

interface AddLocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddLocationModal = ({ open, onOpenChange }: AddLocationModalProps) => {
  const { addLocation } = useLocationContext();
  const { toast } = useToast();

  const handleSubmit = (locationData: any) => {
    try {
      addLocation(locationData);
      toast({
        title: "Success",
        description: "Location added successfully!",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add location. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Location</DialogTitle>
          <DialogDescription>
            Add a new cafe location to your business network.
          </DialogDescription>
        </DialogHeader>
        
        <LocationForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddLocationModal;
