
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, Clock, Edit } from "lucide-react";
import { useEmployeeContext } from "@/contexts/EmployeeContext";
import { useShiftContext } from "@/contexts/ShiftContext";
import { useToast } from "@/hooks/use-toast";

const EmployeeShiftAssignment = () => {
  const { employees, assignDefaultShift } = useEmployeeContext();
  const { shifts, getShiftById } = useShiftContext();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [selectedShiftId, setSelectedShiftId] = useState<string>("");

  const handleAssignShift = () => {
    if (!selectedEmployeeId || !selectedShiftId) {
      toast({
        title: "Validation Error",
        description: "Please select both employee and shift.",
        variant: "destructive",
      });
      return;
    }

    assignDefaultShift(selectedEmployeeId, parseInt(selectedShiftId));
    toast({
      title: "Shift Assigned",
      description: "Employee shift has been updated successfully.",
    });
    
    setIsDialogOpen(false);
    setSelectedEmployeeId(null);
    setSelectedShiftId("");
  };

  const handleEditAssignment = (employeeId: number) => {
    setSelectedEmployeeId(employeeId);
    const employee = employees.find(e => e.id === employeeId);
    setSelectedShiftId(employee?.defaultShiftId?.toString() || "");
    setIsDialogOpen(true);
  };

  const getShiftBadgeColor = (shiftId?: number) => {
    if (!shiftId) return "bg-gray-100 text-gray-800";
    const shift = getShiftById(shiftId);
    if (!shift) return "bg-gray-100 text-gray-800";
    
    switch (shift.type) {
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
          <h3 className="text-xl font-semibold">Employee Shift Assignments</h3>
          <p className="text-gray-600">Assign default shifts to employees</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Assign Shifts
        </Button>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Default Shift</TableHead>
              <TableHead>Shift Hours</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => {
              const shift = employee.defaultShiftId ? getShiftById(employee.defaultShiftId) : null;
              return (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {employee.avatar}
                      </div>
                      <span className="font-medium">{employee.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>{employee.location}</TableCell>
                  <TableCell>
                    {shift ? (
                      <Badge className={getShiftBadgeColor(employee.defaultShiftId)}>
                        {shift.name}
                      </Badge>
                    ) : (
                      <Badge variant="outline">No Shift Assigned</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {shift ? (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {shift.startTime} - {shift.endTime}
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      employee.status === 'Active' ? 'bg-green-100 text-green-800' :
                      employee.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditAssignment(employee.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Assign Shift to Employee</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Employee</label>
              <Select 
                value={selectedEmployeeId?.toString() || ""} 
                onValueChange={(value) => setSelectedEmployeeId(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id.toString()}>
                      {employee.name} - {employee.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Shift</label>
              <Select value={selectedShiftId} onValueChange={setSelectedShiftId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select shift" />
                </SelectTrigger>
                <SelectContent>
                  {shifts.map((shift) => (
                    <SelectItem key={shift.id} value={shift.id.toString()}>
                      {shift.name} ({shift.startTime} - {shift.endTime})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignShift}>
              Assign Shift
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeShiftAssignment;
