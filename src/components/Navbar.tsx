
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Calculator, 
  Clock, 
  FileText, 
  Settings, 
  Bell,
  Coffee,
  Menu,
  MapPin
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { icon: Users, label: "Employees", href: "/employees" },
    { icon: Calculator, label: "Payroll", href: "/payroll" },
    { icon: Clock, label: "Attendance", href: "/attendance" },
    { icon: MapPin, label: "Locations", href: "/locations" },
    { icon: FileText, label: "Reports", href: "/reports" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="bg-gradient-to-r from-orange-500 to-blue-600 p-2 rounded-lg">
              <Coffee className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">CafePayroll</h1>
              <p className="text-xs text-gray-600">Mumbai Cafe Chain</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="flex items-center space-x-2 px-4 py-2 hover:bg-orange-50"
                onClick={() => navigate(item.href)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </Button>
            <div className="hidden md:flex items-center space-x-2">
              <div className="text-right">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-600">Super Admin</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className="w-full justify-start flex items-center space-x-2 px-4 py-2"
                  onClick={() => {
                    navigate(item.href);
                    setIsMenuOpen(false);
                  }}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
