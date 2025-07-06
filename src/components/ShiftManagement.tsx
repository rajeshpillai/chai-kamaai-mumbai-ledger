
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Plus, Edit, Trash2 } from "lucide-react";
import { useShiftContext, Shift, ShiftType } from "@/contexts/ShiftContext";
import { useToast } from "@/hooks/use-toast";

const ShiftManagement = () => {
  const { shifts, addShift, updateShift, deleteShift } = useShiftContext();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Day' as ShiftType,
    startTime: '',
    endTime: '',
    standardHours: 8,
    overtimeMultiplier: 1.5,
    nightDifferential: 0
  });

  const handleSave = () => {
    if (!formData.name || !formData.startTime || !formData.endTime) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (editingShift) {
      updateShift(editingShift.id, formData);
      toast({
        title: "Shift Updated",
        description: `Shift ${formData.name} has been updated successfully.`,
      });
    } else {
      addShift(formData);
      toast({
        title: "Shift Added",
        description: `Shift ${formData.name} has been added successfully.`,
      });
    }

    handleClose();
  };

  const handleEdit = (shift: Shift) => {
    setEditingShift(shift);
    setFormData({
      name: shift.name,
      type: shift.type,
      startTime: shift.startTime,
      endTime: shift.endTime,
      standardHours: shift.standardHours,
      overtimeMultiplier: shift.overtimeMultiplier,
      nightDifferential: shift.nightDifferential || 0
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteShift(id);
    toast({
      title: "Shift Deleted",
      description: "Shift has been deleted successfully.",
    });
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setEditingShift(null);
    setFormData({
      name: '',
      type: 'Day',
      startTime: '',
      endTime: '',
      standardHours: 8,
      overtimeMultiplier: 1.5,
      nightDifferential: 0
    });
  };

  const getShiftTypeColor = (type: ShiftType) => {
    switch (type) {
      case 'Day': return 'bg-green-100 text-green-800';
      case 'Night': return 'bg-blue-100 text-blue-800';
      case 'Weekend': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Shift Management</h3>
          <p className="text-gray-600">Manage work shifts and overtime rules</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Shift
        </Button>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shift Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Standard Hours</TableHead>
              <TableHead>Overtime Rate</TableHead>
              <TableHead>Night Differential</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shifts.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell className="font-medium">{shift.name}</TableCell>
                <TableCell>
                  <Badge className={getShiftTypeColor(shift.type)}>
                    {shift.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {shift.startTime} - {shift.endTime}
                  </div>
                </TableCell>
                <TableCell>{shift.standardHours}h</TableCell>
                <TableCell>{shift.overtimeMultiplier}x</TableCell>
                <TableCell>{shift.nightDifferential || 0}%</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(shift)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDelete(shift.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingShift ? 'Edit Shift' : 'Add New Shift'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Shift Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter shift name"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Shift Type</Label>
              <Select value={formData.type} onValueChange={(value: ShiftType) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Day">Day Shift</SelectItem>
                  <SelectItem value="Night">Night Shift</SelectItem>
                  <SelectItem value="Weekend">Weekend Shift</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="standardHours">Standard Hours</Label>
                <Input
                  id="standardHours"
                  type="number"
                  step="0.5"
                  value={formData.standardHours}
                  onChange={(e) => setFormData({ ...formData, standardHours: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="overtimeMultiplier">Overtime Rate</Label>
                <Input
                  id="overtimeMultiplier"
                  type="number"
                  step="0.1"
                  value={formData.overtimeMultiplier}
                  onChange={(e) => setFormData({ ...formData, overtimeMultiplier: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nightDifferential">Night Differential (%)</Label>
              <Input
                id="nightDifferential"
                type="number"
                step="1"
                value={formData.nightDifferential}
                onChange={(e) => setFormData({ ...formData, nightDifferential: parseFloat(e.target.value) })}
                placeholder="Additional percentage for night shifts"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingShift ? 'Update Shift' : 'Add Shift'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShiftManagement;
