
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, AlertCircle, Users } from "lucide-react";
import { useEmployeeContext } from "@/contexts/EmployeeContext";
import { useAttendanceContext } from "@/contexts/AttendanceContext";

const AttendanceDashboard = () => {
  const { employees } = useEmployeeContext();
  const { getTodayAttendance, markAttendance } = useAttendanceContext();
  
  const todayAttendance = getTodayAttendance();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present": return "bg-green-100 text-green-800";
      case "Late": return "bg-yellow-100 text-yellow-800";
      case "Absent": return "bg-red-100 text-red-800";
      case "Half Day": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleQuickCheckIn = (employeeId: number, location: string) => {
    markAttendance(employeeId, 'checkin', location);
  };

  const handleQuickCheckOut = (employeeId: number, location: string) => {
    markAttendance(employeeId, 'checkout', location);
  };

  const presentCount = todayAttendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
  const absentCount = employees.length - todayAttendance.length;
  const lateCount = todayAttendance.filter(a => a.status === 'Late').length;

  return (
    <div className="space-y-6">
      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{employees.length}</p>
          <p className="text-sm text-gray-600">Total Employees</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">{presentCount}</p>
          <p className="text-sm text-gray-600">Present Today</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-yellow-600">{lateCount}</p>
          <p className="text-sm text-gray-600">Late Arrivals</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600">{absentCount}</p>
          <p className="text-sm text-gray-600">Absent</p>
        </Card>
      </div>

      {/* Today's Attendance List */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Today's Attendance</h3>
        <div className="space-y-4">
          {employees.map((employee) => {
            const attendance = todayAttendance.find(a => a.employeeId === employee.id);
            
            return (
              <div key={employee.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {employee.avatar}
                  </div>
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-gray-600">{employee.role} - {employee.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {attendance ? (
                    <>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            In: {attendance.checkIn} {attendance.checkOut && `| Out: ${attendance.checkOut}`}
                          </span>
                        </div>
                        <Badge className={getStatusColor(attendance.status)}>
                          {attendance.status}
                        </Badge>
                      </div>
                      {!attendance.checkOut && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleQuickCheckOut(employee.id, employee.location)}
                        >
                          Check Out
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <Badge className="bg-red-100 text-red-800">Not Marked</Badge>
                      <Button 
                        size="sm"
                        onClick={() => handleQuickCheckIn(employee.id, employee.location)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Check In
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default AttendanceDashboard;
