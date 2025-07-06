
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  Mail,
  Clock,
  Edit,
  Trash2,
  Building
} from "lucide-react";
import Navbar from "@/components/Navbar";
import AddLocationModal from "@/components/AddLocationModal";
import EditLocationModal from "@/components/EditLocationModal";
import { useLocationContext, Location } from "@/contexts/LocationContext";

const Locations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [addLocationOpen, setAddLocationOpen] = useState(false);
  const [editLocationOpen, setEditLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const { locations, deleteLocation } = useLocationContext();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Inactive": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleEditLocation = (location: Location) => {
    setSelectedLocation(location);
    setEditLocationOpen(true);
  };

  const handleDeleteLocation = (locationId: number) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      deleteLocation(locationId);
    }
  };

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Location Management</h1>
            <p className="text-gray-600">Manage your cafe locations and their settings</p>
          </div>
          <Button 
            className="bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 mt-4 md:mt-0"
            onClick={() => setAddLocationOpen(true)}
          >
            <Building className="h-4 w-4 mr-2" />
            Add Location
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search locations by name, city, or state..."
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

        {/* Location Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((location) => (
            <Card key={location.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    <Building className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{location.name}</h3>
                    <p className="text-sm text-gray-600">{location.city}, {location.state}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(location.status)}>
                  {location.status}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {location.address}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {location.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {location.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {location.workingHours.start} - {location.workingHours.end}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Overtime Rate</p>
                    <p className="font-semibold text-lg text-gray-800">{location.overtimeRate}x</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditLocation(location)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteLocation(location.id)}
                    >
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
            <p className="text-2xl font-bold text-blue-600">{locations.length}</p>
            <p className="text-sm text-gray-600">Total Locations</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {locations.filter(l => l.status === 'Active').length}
            </p>
            <p className="text-sm text-gray-600">Active</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">
              {locations.filter(l => l.status === 'Inactive').length}
            </p>
            <p className="text-sm text-gray-600">Inactive</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {new Set(locations.map(l => l.city)).size}
            </p>
            <p className="text-sm text-gray-600">Cities</p>
          </Card>
        </div>
      </div>

      <AddLocationModal open={addLocationOpen} onOpenChange={setAddLocationOpen} />
      <EditLocationModal 
        open={editLocationOpen} 
        onOpenChange={setEditLocationOpen}
        location={selectedLocation}
      />
    </div>
  );
};

export default Locations;
