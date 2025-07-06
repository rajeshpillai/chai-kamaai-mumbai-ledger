
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  UserPlus, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  MoreVertical,
  Edit,
  Trash2
} from "lucide-react";
import Navbar from "@/components/Navbar";

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const employees = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Store Manager",
      location: "Bandra West",
      phone: "+91 98765 43210",
      email: "priya.sharma@cafepay.com",
      salary: "₹45,000",
      joinDate: "2023-03-15",
      status: "Active",
      avatar: "PS"
    },
    {
      id: 2,
      name: "Rohit Patel",
      role: "Barista",
      location: "Andheri East",
      phone: "+91 87654 32109",
      email: "rohit.patel@cafepay.com",
      salary: "₹25,000",
      joinDate: "2023-06-20",
      status: "Active",
      avatar: "RP"
    },
    {
      id: 3,
      name: "Sneha Kulkarni",
      role: "Cashier",
      location: "Powai",
      phone: "+91 76543 21098",
      email: "sneha.k@cafepay.com",
      salary: "₹22,000",
      joinDate: "2023-08-10",
      status: "Active",
      avatar: "SK"
    },
    {
      id: 4,
      name: "Arjun Singh",
      role: "Kitchen Staff",
      location: "Bandra West",
      phone: "+91 65432 10987",
      email: "arjun.singh@cafepay.com",
      salary: "₹20,000",
      joinDate: "2023-09-05",
      status: "On Leave",
      avatar: "AS"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "On Leave": return "bg-yellow-100 text-yellow-800";
      case "Inactive": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Employee Management</h1>
            <p className="text-gray-600">Manage your cafe staff across all locations</p>
          </div>
          <Button className="bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 mt-4 md:mt-0">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search employees by name, role, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </Card>

        {/* Employee Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {employee.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{employee.name}</h3>
                    <p className="text-sm text-gray-600">{employee.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(employee.status)}>
                    {employee.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {employee.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {employee.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {employee.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Joined: {new Date(employee.joinDate).toLocaleDateString('en-IN')}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Salary</p>
                    <p className="font-semibold text-lg text-gray-800">{employee.salary}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{employees.length}</p>
            <p className="text-sm text-gray-600">Total Employees</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {employees.filter(e => e.status === 'Active').length}
            </p>
            <p className="text-sm text-gray-600">Active</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {employees.filter(e => e.status === 'On Leave').length}
            </p>
            <p className="text-sm text-gray-600">On Leave</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">8</p>
            <p className="text-sm text-gray-600">Locations</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Employees;
