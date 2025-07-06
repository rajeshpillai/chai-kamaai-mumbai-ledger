
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, TrendingUp, Users, Clock, AlertTriangle } from "lucide-react";
import { useEmployeeContext } from "@/contexts/EmployeeContext";
import { useAttendanceContext } from "@/contexts/AttendanceContext";

const AttendanceReports = () => {
  const { employees } = useEmployeeContext();
  const { attendanceRecords } = useAttendanceContext();
  const [reportType, setReportType] = useState<"monthly" | "location" | "employee">("monthly");
  const [selectedMonth, setSelectedMonth] = useState<string>("2025-01");

  // Calculate monthly statistics
  const getMonthlyStats = () => {
    const monthRecords = attendanceRecords.filter(record => 
      record.date.startsWith(selectedMonth)
    );
    
    const totalPresent = monthRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;
    const totalLate = monthRecords.filter(r => r.status === 'Late').length;
    const totalAbsent = employees.length * 30 - monthRecords.length; // Approximate

    return { totalPresent, totalLate, totalAbsent, totalRecords: monthRecords.length };
  };

  // Location-wise statistics
  const getLocationStats = () => {
    const locations = [...new Set(employees.map(emp => emp.location))];
    return locations.map(location => {
      const locationEmployees = employees.filter(emp => emp.location === location);
      const locationRecords = attendanceRecords.filter(record => 
        locationEmployees.some(emp => emp.id === record.employeeId)
      );
      
      return {
        location,
        totalEmployees: locationEmployees.length,
        presentToday: locationRecords.filter(r => r.date === new Date().toISOString().split('T')[0]).length,
        attendanceRate: Math.round((locationRecords.length / (locationEmployees.length * 30)) * 100)
      };
    });
  };

  // Chart data for monthly trends
  const getChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const dayRecords = attendanceRecords.filter(r => r.date === dateString);
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        present: dayRecords.filter(r => r.status === 'Present').length,
        late: dayRecords.filter(r => r.status === 'Late').length,
        absent: employees.length - dayRecords.length
      };
    }).reverse();
    
    return last7Days;
  };

  // Pie chart data for status distribution
  const getStatusDistribution = () => {
    const todayRecords = attendanceRecords.filter(r => 
      r.date === new Date().toISOString().split('T')[0]
    );
    
    return [
      { name: 'Present', value: todayRecords.filter(r => r.status === 'Present').length, color: '#10B981' },
      { name: 'Late', value: todayRecords.filter(r => r.status === 'Late').length, color: '#F59E0B' },
      { name: 'Absent', value: employees.length - todayRecords.length, color: '#EF4444' }
    ];
  };

  const handleExportReport = () => {
    console.log("Exporting attendance report...");
    // This would typically generate and download a CSV/PDF report
  };

  const monthlyStats = getMonthlyStats();
  const locationStats = getLocationStats();
  const chartData = getChartData();
  const statusData = getStatusDistribution();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-semibold">Attendance Reports</h3>
          <p className="text-gray-600">Comprehensive attendance analytics and insights</p>
        </div>
        <div className="flex gap-2">
          <Select value={reportType} onValueChange={(value: "monthly" | "location" | "employee") => setReportType(value)}>
            <SelectTrigger className="w-48">
              <TrendingUp className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly Report</SelectItem>
              <SelectItem value="location">Location Report</SelectItem>
              <SelectItem value="employee">Employee Report</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportReport} className="bg-green-600 hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{monthlyStats.totalPresent}</p>
          <p className="text-sm text-gray-600">Total Present</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-yellow-600">{monthlyStats.totalLate}</p>
          <p className="text-sm text-gray-600">Late Arrivals</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600">{monthlyStats.totalAbsent}</p>
          <p className="text-sm text-gray-600">Total Absent</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">
            {Math.round((monthlyStats.totalPresent / (monthlyStats.totalPresent + monthlyStats.totalAbsent)) * 100)}%
          </p>
          <p className="text-sm text-gray-600">Attendance Rate</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend Chart */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">Weekly Attendance Trend</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="present" fill="#10B981" name="Present" />
              <Bar dataKey="late" fill="#F59E0B" name="Late" />
              <Bar dataKey="absent" fill="#EF4444" name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Status Distribution */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">Today's Status Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={(entry) => `${entry.name}: ${entry.value}`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Location-wise Report */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4">Location-wise Attendance</h4>
        <div className="space-y-4">
          {locationStats.map((location, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{location.location}</p>
                <p className="text-sm text-gray-600">{location.totalEmployees} employees</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm">Present Today: {location.presentToday}</p>
                  <Badge className="bg-blue-100 text-blue-800">
                    {location.attendanceRate}% Rate
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AttendanceReports;
