
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  Calculator, 
  FileText, 
  Clock, 
  MapPin, 
  Download,
  Plus,
  PlayCircle
} from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      icon: UserPlus,
      title: "Add Employee",
      description: "Register new cafe staff member",
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => console.log("Add Employee clicked")
    },
    {
      icon: Calculator,
      title: "Run Payroll",
      description: "Process monthly salary calculations",
      color: "bg-green-500 hover:bg-green-600",
      action: () => console.log("Run Payroll clicked")
    },
    {
      icon: Clock,
      title: "Mark Attendance",
      description: "Update daily attendance records",
      color: "bg-orange-500 hover:bg-orange-600",
      action: () => console.log("Mark Attendance clicked")
    },
    {
      icon: FileText,
      title: "Generate Report",
      description: "Create compliance and payroll reports",
      color: "bg-purple-500 hover:bg-purple-600",
      action: () => console.log("Generate Report clicked")
    },
    {
      icon: MapPin,
      title: "Add Location",
      description: "Register new cafe branch",
      color: "bg-indigo-500 hover:bg-indigo-600",
      action: () => console.log("Add Location clicked")
    },
    {
      icon: Download,
      title: "Export Data",
      description: "Download payroll and employee data",
      color: "bg-gray-500 hover:bg-gray-600",
      action: () => console.log("Export Data clicked")
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Customize
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <div key={index} className="group">
            <Button
              onClick={action.action}
              className={`${action.color} w-full h-auto p-4 flex flex-col items-center text-white transition-all duration-200 group-hover:scale-105`}
            >
              <action.icon className="h-8 w-8 mb-2" />
              <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
              <p className="text-xs opacity-90 text-center">{action.description}</p>
            </Button>
          </div>
        ))}
      </div>

      {/* Quick Start Tutorial */}
      <div className="mt-6 p-4 bg-gradient-to-r from-orange-100 to-blue-100 rounded-lg border border-orange-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">New to CafePayroll?</h3>
            <p className="text-sm text-gray-600">Get started with our step-by-step setup guide</p>
          </div>
          <Button variant="outline" size="sm" className="bg-white">
            <PlayCircle className="h-4 w-4 mr-1" />
            Start Tutorial
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default QuickActions;
