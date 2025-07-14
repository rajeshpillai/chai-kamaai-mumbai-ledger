
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { EmployeeProvider } from "@/contexts/EmployeeContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { AttendanceProvider } from "@/contexts/AttendanceContext";
import { PayrollProvider } from "@/contexts/PayrollContext";
import { ShiftProvider } from "@/contexts/ShiftContext";
import { LeaveProvider } from "@/contexts/LeaveContext";
import { AuditProvider } from "@/contexts/AuditContext";
import { ComplianceProvider } from "@/contexts/ComplianceContext";
import Index from "@/pages/Index";
import Employees from "@/pages/Employees";
import Locations from "@/pages/Locations";
import Attendance from "@/pages/Attendance";
import Payroll from "@/pages/Payroll";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import "./App.css";

function App() {
  return (
    <Router>
      <AuditProvider>
        <ComplianceProvider>
          <LocationProvider>
            <EmployeeProvider>
              <ShiftProvider>
                <LeaveProvider>
                  <AttendanceProvider>
                    <PayrollProvider>
                      <div className="min-h-screen bg-gray-50">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/employees" element={<Employees />} />
                          <Route path="/locations" element={<Locations />} />
                          <Route path="/attendance" element={<Attendance />} />
                          <Route path="/payroll" element={<Payroll />} />
                          <Route path="/reports" element={<Reports />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </div>
                      <Toaster />
                    </PayrollProvider>
                  </AttendanceProvider>
                </LeaveProvider>
              </ShiftProvider>
            </EmployeeProvider>
          </LocationProvider>
        </ComplianceProvider>
      </AuditProvider>
    </Router>
  );
}

export default App;
