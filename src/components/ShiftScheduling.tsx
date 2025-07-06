
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Plus, Trash2 } from "lucide-react";
import { useEmployeeContext } from "@/contexts/EmployeeContext";
import { useShiftContext } from "@/contexts/ShiftContext";
import { useToast } from "@/hooks/use-toast";

const ShiftScheduling = () => {
  const { employees } = useEmployeeContext();
  const { shifts, shiftAssignments, assignShift, getShiftById } = useShiftContext();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [selectedShiftId, setSelectedShiftId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const handleScheduleShift = () => {
    if (!selectedEmployeeId || !selectedShiftId || !selectedDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    // Check if employee already has a shift on this date
    const existingAssignment = shiftAssignments.find(
      a => a.employeeId === parseInt(selectedEmployeeId) && a.date === selectedDate
    );

    if (existingAssignment) {
      toast({
        title: "Conflict",
        description: "Employee already has a shift scheduled for this date.",
        variant: "destructive",
      });
      return;
    }

    assignShift(parseInt(selectedEmployeeId), parseInt(selectedShiftId), selectedDate);
    toast({
      title: "Shift Scheduled",
      description: "Shift has been scheduled successfully.",
    });
    
    setIsDialogOpen(false);
    setSelectedEmployeeId("");
    setSelectedShiftId("");
    setSelectedDate("");
  };

  const getUpcomingAssignments = () => {
    const today = new Date();
    return shiftAssignments
      .filter(assignment => new Date(assignment.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 10); // Show next 10 assignments
  };

  const getEmployeeName = (employeeId: number) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? employee.name : "Unknown";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Missed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Shift Scheduling</h3>
          <p className="text-gray-600">Schedule shifts for specific dates</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Schedule Shift
        </Button>
      </div>

      <Card className="p-6">
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Upcoming Scheduled Shifts</h4>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Shift</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getUpcomingAssignments().length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  No scheduled shifts found. Schedule your first shift above.
                </TableCell>
              </TableRow>
            ) : (
              getUpcomingAssignments().map((assignment) => {
                const shift = getShiftById(assignment.shiftId);
                return (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(assignment.date).toLocaleDateString('en-IN')}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {getEmployeeName(assignment.employeeId)}
                    </TableCell>
                    <TableCell>
                      {shift ? shift.name : "Unknown Shift"}
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
                      <Badge className={getStatusColor(assignment.status)}>
                        {assignment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Schedule Shift</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Employee</label>
              <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.filter(e => e.status === 'Active').map((employee) => (
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
            <Button onClick={handleScheduleShift}>
              Schedule Shift
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShiftScheduling;
