
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useEmployeeContext } from '@/contexts/EmployeeContext';
import { useLeaveContext, LeaveType } from '@/contexts/LeaveContext';
import { useToast } from '@/hooks/use-toast';

interface LeaveApplicationModalProps {
  open: boolean;
  onClose: () => void;
}

const LeaveApplicationModal = ({ open, onClose }: LeaveApplicationModalProps) => {
  const [employeeId, setEmployeeId] = useState<string>('');
  const [leaveType, setLeaveType] = useState<LeaveType>('Annual');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [reason, setReason] = useState('');
  const [isPaid, setIsPaid] = useState(true);

  const { employees } = useEmployeeContext();
  const { applyLeave, getEmployeeBalance } = useLeaveContext();
  const { toast } = useToast();

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!employeeId || !startDate || !endDate || !reason.trim()) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const days = calculateDays();
    const balance = getEmployeeBalance(parseInt(employeeId));
    const leaveTypeKey = leaveType.toLowerCase() as keyof Omit<typeof balance, 'employeeId'>;
    
    if (balance && balance[leaveTypeKey] < days) {
      toast({
        title: "Insufficient Balance",
        description: `You only have ${balance[leaveTypeKey]} ${leaveType.toLowerCase()} leave days remaining`,
        variant: "destructive"
      });
      return;
    }

    applyLeave({
      employeeId: parseInt(employeeId),
      type: leaveType,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      days,
      reason,
      isPaid
    });

    toast({
      title: "Leave Applied",
      description: "Your leave request has been submitted for approval"
    });

    // Reset form
    setEmployeeId('');
    setLeaveType('Annual');
    setStartDate(undefined);
    setEndDate(undefined);
    setReason('');
    setIsPaid(true);
    onClose();
  };

  const selectedEmployee = employees.find(emp => emp.id === parseInt(employeeId));
  const balance = selectedEmployee ? getEmployeeBalance(selectedEmployee.id) : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Apply for Leave</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="employee">Employee</Label>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map(emp => (
                  <SelectItem key={emp.id} value={emp.id.toString()}>
                    {emp.name} - {emp.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="leaveType">Leave Type</Label>
            <Select value={leaveType} onValueChange={(value: LeaveType) => setLeaveType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Annual">Annual Leave</SelectItem>
                <SelectItem value="Sick">Sick Leave</SelectItem>
                <SelectItem value="Casual">Casual Leave</SelectItem>
                <SelectItem value="Maternity">Maternity Leave</SelectItem>
                <SelectItem value="Paternity">Paternity Leave</SelectItem>
                <SelectItem value="Emergency">Emergency Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {balance && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">
                Available {leaveType} Leave: <strong>{balance[leaveType.toLowerCase() as keyof Omit<typeof balance, 'employeeId'>]} days</strong>
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick start date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick end date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {startDate && endDate && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Total Days: <strong>{calculateDays()} days</strong>
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for leave..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPaid"
              checked={isPaid}
              onChange={(e) => setIsPaid(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="isPaid">Paid Leave</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Submit Application
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveApplicationModal;
