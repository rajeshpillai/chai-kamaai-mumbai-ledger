
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar as CalendarIcon, User, Clock } from "lucide-react";
import { useEmployeeContext } from "@/contexts/EmployeeContext";
import { useAttendanceContext } from "@/contexts/AttendanceContext";
import { format } from "date-fns";

const AttendanceHistory = () => {
  const { employees } = useEmployeeContext();
  const { attendanceRecords, getAttendanceByDate, getEmployeeAttendance } = useAttendanceContext();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"calendar" | "table">("calendar");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present": return "bg-green-100 text-green-800";
      case "Late": return "bg-yellow-100 text-yellow-800";
      case "Absent": return "bg-red-100 text-red-800";
      case "Half Day": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDayAttendance = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return getAttendanceByDate(dateString);
  };

  const getFilteredRecords = () => {
    if (selectedEmployee === "all") {
      return attendanceRecords;
    }
    return getEmployeeAttendance(parseInt(selectedEmployee));
  };

  const getEmployeeName = (employeeId: number) => {
    return employees.find(emp => emp.id === employeeId)?.name || "Unknown";
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-semibold">Attendance History</h3>
          <p className="text-gray-600">View historical attendance records and patterns</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-48">
              <User className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {employees.map(employee => (
                <SelectItem key={employee.id} value={employee.id.toString()}>
                  {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            onClick={() => setViewMode("calendar")}
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Calendar
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            onClick={() => setViewMode("table")}
          >
            <Clock className="h-4 w-4 mr-2" />
            Table
          </Button>
        </div>
      </div>

      {viewMode === "calendar" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-4">Select Date</h4>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </Card>

          {/* Selected Date Details */}
          <Card className="lg:col-span-2 p-6">
            <h4 className="text-lg font-semibold mb-4">
              Attendance for {format(selectedDate, 'MMMM dd, yyyy')}
            </h4>
            <div className="space-y-3">
              {getDayAttendance(selectedDate).length > 0 ? (
                getDayAttendance(selectedDate).map(record => (
                  <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {getEmployeeName(record.employeeId).charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{getEmployeeName(record.employeeId)}</p>
                        <p className="text-sm text-gray-600">{record.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm">
                          In: {record.checkIn} {record.checkOut && `| Out: ${record.checkOut}`}
                        </p>
                        <Badge className={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No attendance records for this date</p>
              )}
            </div>
          </Card>
        </div>
      ) : (
        /* Table View */
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">Attendance Records</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getFilteredRecords().length > 0 ? (
                getFilteredRecords().map(record => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {getEmployeeName(record.employeeId)}
                    </TableCell>
                    <TableCell>{format(new Date(record.date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{record.checkIn || '-'}</TableCell>
                    <TableCell>{record.checkOut || '-'}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.location}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No attendance records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};

export default AttendanceHistory;
