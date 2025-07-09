
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEmployeeContext } from '@/contexts/EmployeeContext';
import { useLeaveContext } from '@/contexts/LeaveContext';
import LeaveApplicationModal from './LeaveApplicationModal';
import LeaveApprovalDashboard from './LeaveApprovalDashboard';
import LeaveCalendar from './LeaveCalendar';
import ErrorBoundary from './ErrorBoundary';
import { CalendarDays, Clock, UserCheck, Plus } from 'lucide-react';

const LeaveManagement = () => {
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'apply' | 'approve' | 'calendar'>('overview');
  const [isInitialized, setIsInitialized] = useState(false);
  const { employees } = useEmployeeContext();
  const { leaveBalances, leaveRequests, initializeEmployeeBalance } = useLeaveContext();

  // Initialize leave balances for all employees with better error handling
  useEffect(() => {
    if (employees.length > 0 && !isInitialized) {
      console.log('Initializing leave balances for employees:', employees.length);
      
      try {
        employees.forEach(emp => {
          const existingBalance = leaveBalances.find(balance => balance.employeeId === emp.id);
          if (!existingBalance) {
            console.log('Initializing balance for employee:', emp.id, emp.name);
            initializeEmployeeBalance(emp.id);
          }
        });
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing employee leave balances:', error);
      }
    }
  }, [employees, leaveBalances, initializeEmployeeBalance, isInitialized]);

  const pendingRequests = leaveRequests.filter(req => req.status === 'Pending');
  const totalEmployees = employees.length;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'apply':
        return (
          <ErrorBoundary>
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Apply for Leave</h3>
                <Button onClick={() => setShowApplicationModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Leave Request
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {leaveBalances.slice(0, 3).map(balance => {
                  const employee = employees.find(emp => emp.id === balance.employeeId);
                  return employee ? (
                    <Card key={balance.employeeId}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">{employee.name} - Leave Balance</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Annual:</span>
                          <Badge variant="outline">{balance.annual || 0} days</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Sick:</span>
                          <Badge variant="outline">{balance.sick || 0} days</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Casual:</span>
                          <Badge variant="outline">{balance.casual || 0} days</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ) : null;
                })}
              </div>
            </div>
          </ErrorBoundary>
        );
      case 'approve':
        return (
          <ErrorBoundary>
            <LeaveApprovalDashboard />
          </ErrorBoundary>
        );
      case 'calendar':
        return (
          <ErrorBoundary>
            <LeaveCalendar />
          </ErrorBoundary>
        );
      default:
        return (
          <ErrorBoundary>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingRequests.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting approval
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalEmployees}</div>
                  <p className="text-xs text-muted-foreground">
                    Active employees
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Month</CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {leaveRequests.filter(req => 
                      req.status === 'Approved' && 
                      new Date(req.startDate).getMonth() === new Date().getMonth()
                    ).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Approved leaves
                  </p>
                </CardContent>
              </Card>
            </div>
          </ErrorBoundary>
        );
    }
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Leave Management</h2>
          <div className="flex gap-2">
            <Button 
              variant={activeTab === 'overview' ? 'default' : 'outline'}
              onClick={() => setActiveTab('overview')}
              size="sm"
            >
              Overview
            </Button>
            <Button 
              variant={activeTab === 'apply' ? 'default' : 'outline'}
              onClick={() => setActiveTab('apply')}
              size="sm"
            >
              Apply Leave
            </Button>
            <Button 
              variant={activeTab === 'approve' ? 'default' : 'outline'}
              onClick={() => setActiveTab('approve')}
              size="sm"
            >
              Approve Requests
            </Button>
            <Button 
              variant={activeTab === 'calendar' ? 'default' : 'outline'}
              onClick={() => setActiveTab('calendar')}
              size="sm"
            >
              Calendar
            </Button>
          </div>
        </div>

        {renderTabContent()}

        <LeaveApplicationModal 
          open={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
        />
      </div>
    </ErrorBoundary>
  );
};

export default LeaveManagement;
