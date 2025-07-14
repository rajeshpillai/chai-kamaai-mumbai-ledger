
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calculator, Clock, FileText, MapPin, TrendingUp, Building, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import StatsCard from "@/components/StatsCard";
import QuickActions from "@/components/QuickActions";
import { useEmployeeContext } from "@/contexts/EmployeeContext";
import { useLocationContext } from "@/contexts/LocationContext";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const { employees } = useEmployeeContext();
  const { locations } = useLocationContext();
  
  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
  const activeLocations = locations.filter(loc => loc.status === 'Active').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Cafe Chain Payroll Management
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Streamline your cafe operations with comprehensive payroll, attendance, and compliance management across Mumbai and beyond.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Total Employees" 
            value={employees.length.toString()} 
            icon={Users} 
            trend="+12%" 
            color="bg-blue-500" 
          />
          <StatsCard 
            title="Monthly Payroll" 
            value={`₹${totalSalary.toLocaleString()}`} 
            icon={Calculator} 
            trend="+5%" 
            color="bg-green-500" 
          />
          <StatsCard 
            title="Active Locations" 
            value={activeLocations.toString()} 
            icon={MapPin} 
            trend="+2" 
            color="bg-orange-500" 
          />
          <StatsCard 
            title="Compliance Score" 
            value="98%" 
            icon={FileText} 
            trend="+3%" 
            color="bg-purple-500" 
          />
        </div>

        {/* Compliance Dashboard Widget */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Compliance Overview</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/settings")}
            >
              <FileText className="h-4 w-4 mr-1" />
              Manage Compliance
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Documents Filed</p>
                  <p className="text-2xl font-bold text-green-600">15/17</p>
                </div>
                <FileText className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Actions</p>
                  <p className="text-2xl font-bold text-orange-600">2</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Next Deadline</p>
                  <p className="text-lg font-bold text-blue-600">Jan 7</p>
                  <p className="text-xs text-gray-600">TDS Return</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <QuickActions />

        {/* Locations Overview & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Locations Overview</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/locations")}
              >
                <Building className="h-4 w-4 mr-1" />
                Manage All
              </Button>
            </div>
            <div className="space-y-3">
              {locations.slice(0, 3).map((location) => (
                <div key={location.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{location.name}</p>
                    <p className="text-sm text-gray-600">{location.city} • {location.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{location.workingHours.start} - {location.workingHours.end}</p>
                    <p className="text-xs text-gray-600">Working Hours</p>
                  </div>
                </div>
              ))}
              {locations.length > 3 && (
                <div className="text-center pt-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/locations")}
                  >
                    View all {locations.length} locations
                  </Button>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Payroll Activities</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">December Payroll Processed</p>
                  <p className="text-sm text-gray-600">Bandra West Cafe - 18 employees</p>
                </div>
                <span className="text-green-600 font-semibold">₹1,23,400</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">New Employee Added</p>
                  <p className="text-sm text-gray-600">Rahul Sharma - Barista</p>
                </div>
                <span className="text-blue-600 font-semibold">Andheri East</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Compliance Report Generated</p>
                  <p className="text-sm text-gray-600">PF & ESI Monthly Report</p>
                </div>
                <span className="text-purple-600 font-semibold">November</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Upcoming Tasks */}
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Tasks</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
              <div>
                <p className="font-medium">TDS Return Filing</p>
                <p className="text-sm text-gray-600">Due: 7th January 2025</p>
              </div>
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
              <div>
                <p className="font-medium">January Salary Processing</p>
                <p className="text-sm text-gray-600">All locations</p>
              </div>
              <Calculator className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 border-l-4 border-green-400 rounded-lg">
              <div>
                <p className="font-medium">Annual Appraisal Cycle</p>
                <p className="text-sm text-gray-600">Performance review season</p>
              </div>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
