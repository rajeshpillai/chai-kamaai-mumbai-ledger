
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useEmployeeContext } from '@/contexts/EmployeeContext';
import { useLeaveContext } from '@/contexts/LeaveContext';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

const LeaveApprovalDashboard = () => {
  const { employees } = useEmployeeContext();
  const { leaveRequests, approveLeave, rejectLeave } = useLeaveContext();
  const { toast } = useToast();

  const pendingRequests = leaveRequests.filter(req => req.status === 'Pending');
  
  const handleApprove = (requestId: number) => {
    approveLeave(requestId, 1); // Using employee ID 1 as approver (should be current user in real app)
    toast({
      title: "Leave Approved",
      description: "The leave request has been approved successfully"
    });
  };

  const handleReject = (requestId: number) => {
    rejectLeave(requestId);
    toast({
      title: "Leave Rejected",
      description: "The leave request has been rejected",
      variant: "destructive"
    });
  };

  const getLeaveTypeColor = (type: string) => {
    const colors = {
      'Annual': 'bg-blue-100 text-blue-800',
      'Sick': 'bg-red-100 text-red-800',
      'Casual': 'bg-green-100 text-green-800',
      'Maternity': 'bg-purple-100 text-purple-800',
      'Paternity': 'bg-indigo-100 text-indigo-800',
      'Emergency': 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Leave Approval Dashboard</h3>
        <Badge variant="outline">
          {pendingRequests.length} Pending Requests
        </Badge>
      </div>

      {pendingRequests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
            <p className="text-muted-foreground text-center">
              There are no pending leave requests at the moment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pendingRequests.map(request => {
            const employee = employees.find(emp => emp.id === request.employeeId);
            if (!employee) return null;

            return (
              <Card key={request.id} className="border-l-4 border-l-orange-400">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>{employee.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{employee.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{employee.role} • {employee.department}</p>
                      </div>
                    </div>
                    <Badge className={getLeaveTypeColor(request.type)}>
                      {request.type}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Start Date</p>
                        <p className="text-muted-foreground">{format(new Date(request.startDate), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">End Date</p>
                        <p className="text-muted-foreground">{format(new Date(request.endDate), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Duration</p>
                        <p className="text-muted-foreground">{request.days} day{request.days !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="font-medium">Type</p>
                      <p className="text-muted-foreground">{request.isPaid ? 'Paid' : 'Unpaid'}</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-sm mb-1">Reason:</p>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                      {request.reason}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-muted-foreground">
                      Applied on {format(new Date(request.appliedDate), 'MMM dd, yyyy')}
                    </p>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(request.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(request.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LeaveApprovalDashboard;
