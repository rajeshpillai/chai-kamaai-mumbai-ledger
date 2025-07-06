
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, Clock, Users, MapPin } from "lucide-react";
import { useEmployeeContext } from "@/contexts/EmployeeContext";
import { useAttendanceContext } from "@/contexts/AttendanceContext";

const MarkAttendance = () => {
  const { employees } = useEmployeeContext();
  const { getTodayAttendance, markAttendance } = useAttendanceContext();
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  
  const todayAttendance = getTodayAttendance();
  const locations = [...new Set(employees.map(emp => emp.location))];
  
  const filteredEmployees = selectedLocation === "all" 
    ? employees 
    : employees.filter(emp => emp.location === selectedLocation);

  const handleBulkMarkPresent = () => {
    filteredEmployees.forEach(employee => {
      const hasAttendance = todayAttendance.find(a => a.employeeId === employee.id);
      if (!hasAttendance) {
        markAttendance(employee.id, 'checkin', employee.location);
      }
    });
  };

  const handleBulkMarkAbsent = () => {
    // This would typically update status to absent for employees without attendance
    console.log("Bulk mark absent for remaining employees");
  };

  const getEmployeeAttendanceStatus = (employeeId: number) => {
    return todayAttendance.find(a => a.employeeId === employeeId);
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-semibold">Mark Attendance</h3>
          <p className="text-gray-600">Quickly mark attendance for all employees</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-48">
              <MapPin className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map(location => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleBulkMarkPresent} className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Present
          </Button>
          <Button onClick={handleBulkMarkAbsent} variant="outline">
            <XCircle className="h-4 w-4 mr-2" />
            Mark Remaining Absent
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold">{filteredEmployees.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Marked Present</p>
              <p className="text-2xl font-bold text-green-600">
                {filteredEmployees.filter(emp => 
                  todayAttendance.find(a => a.employeeId === emp.id)
                ).length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Not Marked</p>
              <p className="text-2xl font-bold text-red-600">
                {filteredEmployees.filter(emp => 
                  !todayAttendance.find(a => a.employeeId === emp.id)
                ).length}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Employee List */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4">Employee Attendance</h4>
        <div className="space-y-3">
          {filteredEmployees.map(employee => {
            const attendance = getEmployeeAttendanceStatus(employee.id);
            
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
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">
                        {attendance.status}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {attendance.checkIn}
                      </div>
                      {!attendance.checkOut && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => markAttendance(employee.id, 'checkout', employee.location)}
                        >
                          Check Out
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-red-100 text-red-800">Not Marked</Badge>
                      <Button 
                        size="sm"
                        onClick={() => markAttendance(employee.id, 'checkin', employee.location)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Check In
                      </Button>
                    </div>
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

export default MarkAttendance;
