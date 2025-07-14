import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuditContext } from "@/contexts/AuditContext";
import { Search, Filter, Download, Eye } from "lucide-react";

const AuditLogViewer = () => {
  const { auditLogs, getAuditLogs } = useAuditContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = !searchTerm || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEntity = !selectedEntity || log.entityType === selectedEntity;
    
    return matchesSearch && matchesEntity;
  });

  const entityTypes = [...new Set(auditLogs.map(log => log.entityType))];

  const getActionColor = (action: string) => {
    if (action.includes('Create')) return 'bg-green-100 text-green-800';
    if (action.includes('Update') || action.includes('Edit')) return 'bg-blue-100 text-blue-800';
    if (action.includes('Delete')) return 'bg-red-100 text-red-800';
    if (action.includes('Process')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Audit Trail</h2>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search actions, users, or entities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md"
            >
              <option value="">All Entities</option>
              {entityTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              More Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Audit Logs */}
      <Card className="p-6">
        <div className="space-y-4">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div key={log.id} className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded-r-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Badge className={getActionColor(log.action)}>
                      {log.action}
                    </Badge>
                    <span className="font-medium">{log.entityType}</span>
                    <span className="text-gray-600">ID: {log.entityId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">User:</span> {log.userId}
                  {log.ipAddress && (
                    <span className="ml-4">
                      <span className="font-medium">IP:</span> {log.ipAddress}
                    </span>
                  )}
                </div>
                
                {Object.keys(log.changes).length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Changes:</p>
                    <div className="bg-white p-2 rounded border text-xs">
                      {Object.entries(log.changes).map(([field, change]) => (
                        <div key={field} className="mb-1">
                          <span className="font-medium">{field}:</span>
                          <span className="text-red-600 ml-1">{JSON.stringify(change.old)}</span>
                          <span className="mx-1">→</span>
                          <span className="text-green-600">{JSON.stringify(change.new)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No audit logs found matching your criteria.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AuditLogViewer;