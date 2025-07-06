import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface UserRole {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'HR Manager' | 'Location Manager';
  location?: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

interface UserFormProps {
  user?: UserRole;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<UserRole, 'id' | 'lastLogin'>) => void;
  locations: string[];
}

const UserForm = ({ user, isOpen, onClose, onSave, locations }: UserFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'HR Manager' as const,
    location: '',
    status: 'Active' as const,
  });

  // Update form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location || '',
        status: user.status,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'HR Manager',
        location: '',
        status: 'Active',
      });
    }
  }, [user]);

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.role === 'Location Manager' && !formData.location) {
      toast({
        title: "Validation Error",
        description: "Location is required for Location Manager role.",
        variant: "destructive",
      });
      return;
    }

    onSave({
      ...formData,
      location: formData.role === 'Location Manager' ? formData.location : undefined,
    });
    
    toast({
      title: user ? "User Updated" : "User Added",
      description: `User ${formData.name} has been ${user ? 'updated' : 'added'} successfully.`,
    });
    
    onClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      role: 'HR Manager',
      location: '',
      status: 'Active',
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter full name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value, location: value !== 'Location Manager' ? '' : formData.location })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Super Admin">Super Admin</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="HR Manager">HR Manager</SelectItem>
                <SelectItem value="Location Manager">Location Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {formData.role === 'Location Manager' && (
            <div className="space-y-2">
              <Label>Location</Label>
              <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {user ? 'Update User' : 'Add User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;
