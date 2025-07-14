import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useComplianceContext } from "@/contexts/ComplianceContext";
import { Calendar, Clock, AlertTriangle, CheckCircle, FileText, Download } from "lucide-react";

const ComplianceDashboard = () => {
  const { documents, getUpcomingDeadlines } = useComplianceContext();
  
  const upcomingDeadlines = getUpcomingDeadlines(30);
  const recentDocuments = documents.slice(0, 5);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Filed': return 'bg-green-100 text-green-800';
      case 'Generated': return 'bg-blue-100 text-blue-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Upcoming Deadlines */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            Upcoming Deadlines
          </h3>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-1" />
            View Calendar
          </Button>
        </div>
        
        <div className="space-y-3">
          {upcomingDeadlines.length > 0 ? (
            upcomingDeadlines.map((doc) => {
              const daysLeft = getDaysUntilDue(doc.dueDate);
              const isUrgent = daysLeft <= 7;
              
              return (
                <div key={doc.id} className={`p-3 rounded-lg border ${isUrgent ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-gray-600">Due: {new Date(doc.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      {isUrgent ? (
                        <AlertTriangle className="h-5 w-5 text-red-500 mb-1" />
                      ) : (
                        <Clock className="h-5 w-5 text-orange-500 mb-1" />
                      )}
                      <p className={`text-xs font-medium ${isUrgent ? 'text-red-600' : 'text-orange-600'}`}>
                        {daysLeft} days left
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-4 text-gray-500">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p>No upcoming deadlines</p>
            </div>
          )}
        </div>
      </Card>

      {/* Recent Documents */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Recent Documents
          </h3>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        
        <div className="space-y-3">
          {recentDocuments.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{doc.name}</p>
                <p className="text-sm text-gray-600">{doc.type} • {doc.year}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(doc.status)}>
                  {doc.status}
                </Badge>
                {doc.status === 'Generated' && (
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Compliance Status Overview */}
      <Card className="p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Compliance Status Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold text-green-600">98%</p>
            <p className="text-sm text-gray-600">Compliance Score</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <FileText className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold text-blue-600">{documents.length}</p>
            <p className="text-sm text-gray-600">Total Documents</p>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <Clock className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold text-orange-600">{upcomingDeadlines.length}</p>
            <p className="text-sm text-gray-600">Pending Items</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold text-purple-600">
              {upcomingDeadlines.filter(d => getDaysUntilDue(d.dueDate) <= 7).length}
            </p>
            <p className="text-sm text-gray-600">Urgent Items</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ComplianceDashboard;