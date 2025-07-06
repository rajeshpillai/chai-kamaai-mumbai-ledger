
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { EmployeeProvider } from "@/contexts/EmployeeContext";
import { AttendanceProvider } from "@/contexts/AttendanceContext";
import { PayrollProvider } from "@/contexts/PayrollContext";
import { ShiftProvider } from "@/contexts/ShiftContext";
import { LeaveProvider } from "@/contexts/LeaveContext";
import Index from "@/pages/Index";
import Employees from "@/pages/Employees";
import Attendance from "@/pages/Attendance";
import Payroll from "@/pages/Payroll";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import "./App.css";

function App() {
  return (
    <Router>
      <EmployeeProvider>
        <ShiftProvider>
          <LeaveProvider>
            <AttendanceProvider>
              <PayrollProvider>
                <div className="min-h-screen bg-gray-50">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/employees" element={<Employees />} />
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
    </Router>
  );
}

export default App;
