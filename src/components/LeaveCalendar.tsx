
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { useEmployeeContext } from '@/contexts/EmployeeContext';
import { useLeaveContext } from '@/contexts/LeaveContext';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

const LeaveCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>();
  const { employees } = useEmployeeContext();
  const { leaveRequests } = useLeaveContext();

  const approvedLeaves = leaveRequests.filter(req => req.status === 'Approved');
  
  const getLeaveForDate = (date: Date) => {
    return approvedLeaves.filter(leave => {
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      return date >= startDate && date <= endDate;
    });
  };

  const getLeaveTypeColor = (type: string) => {
    const colors = {
      'Annual': 'bg-blue-500',
      'Sick': 'bg-red-500',
      'Casual': 'bg-green-500',
      'Maternity': 'bg-purple-500',
      'Paternity': 'bg-indigo-500',
      'Emergency': 'bg-orange-500'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const selectedDateLeaves = selectedDate ? getLeaveForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Leave Calendar</h3>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h4 className="font-medium min-w-[140px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </h4>
          <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Monthly View</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={currentDate}
                className="pointer-events-auto"
                components={{
                  Day: ({ date, ...props }) => {
                    const leavesOnDate = getLeaveForDate(date);
                    const isSelected = selectedDate && isSameDay(date, selectedDate);
                    
                    return (
                      <div className="relative">
                        <button
                          {...props}
                          className={`
                            w-9 h-9 text-sm rounded-md hover:bg-accent hover:text-accent-foreground
                            ${isSelected ? 'bg-primary text-primary-foreground' : ''}
                            ${leavesOnDate.length > 0 ? 'font-bold' : ''}
                          `}
                        >
                          {date.getDate()}
                        </button>
                        {leavesOnDate.length > 0 && (
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                            {leavesOnDate.slice(0, 3).map((leave, idx) => (
                              <div
                                key={idx}
                                className={`w-1.5 h-1.5 rounded-full ${getLeaveTypeColor(leave.type)}`}
                              />
                            ))}
                            {leavesOnDate.length > 3 && (
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }
                }}
              />
              
              <div className="mt-4 flex flex-wrap gap-2">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Annual</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Sick</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Casual</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span>Maternity</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span>Emergency</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Users className="h-4 w-4 mr-2" />
                {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'Select a date'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                selectedDateLeaves.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateLeaves.map(leave => {
                      const employee = employees.find(emp => emp.id === leave.employeeId);
                      return employee ? (
                        <div key={leave.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{employee.name}</p>
                            <p className="text-xs text-muted-foreground">{employee.role}</p>
                          </div>
                          <Badge className={`text-xs ${getLeaveTypeColor(leave.type)} text-white`}>
                            {leave.type}
                          </Badge>
                        </div>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No leaves on this date
                  </p>
                )
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Click on a date to see who's on leave
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Monthly Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Leaves:</span>
                  <Badge variant="outline">
                    {approvedLeaves.filter(leave => {
                      const leaveDate = new Date(leave.startDate);
                      return leaveDate.getMonth() === currentDate.getMonth() && 
                             leaveDate.getFullYear() === currentDate.getFullYear();
                    }).length}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Employees on Leave:</span>
                  <Badge variant="outline">
                    {new Set(approvedLeaves.filter(leave => {
                      const leaveDate = new Date(leave.startDate);
                      return leaveDate.getMonth() === currentDate.getMonth() && 
                             leaveDate.getFullYear() === currentDate.getFullYear();
                    }).map(leave => leave.employeeId)).size}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeaveCalendar;
