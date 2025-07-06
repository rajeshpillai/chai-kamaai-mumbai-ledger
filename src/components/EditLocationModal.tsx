
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocationContext, Location } from "@/contexts/LocationContext";
import { useToast } from "@/hooks/use-toast";
import LocationForm from "./LocationForm";

interface EditLocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location: Location | null;
}

const EditLocationModal = ({ open, onOpenChange, location }: EditLocationModalProps) => {
  const { updateLocation } = useLocationContext();
  const { toast } = useToast();

  const handleSubmit = (locationData: any) => {
    if (!location) return;
    
    try {
      updateLocation(location.id, locationData);
      toast({
        title: "Success",
        description: "Location updated successfully!",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update location. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!location) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Location</DialogTitle>
          <DialogDescription>
            Update the details for {location.name}.
          </DialogDescription>
        </DialogHeader>
        
        <LocationForm
          location={location}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditLocationModal;
