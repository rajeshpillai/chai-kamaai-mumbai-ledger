
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  workingHours: {
    start: string;
    end: string;
  };
  overtimeRate: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

interface LocationContextType {
  locations: Location[];
  addLocation: (location: Omit<Location, 'id' | 'createdAt'>) => void;
  updateLocation: (id: number, location: Partial<Location>) => void;
  deleteLocation: (id: number) => void;
  getLocationById: (id: number) => Location | undefined;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const defaultLocations: Location[] = [
  {
    id: 1,
    name: "Bandra West Cafe",
    address: "123 Hill Road, Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400050",
    phone: "+91 98765 43210",
    email: "bandra@cafepayroll.com",
    workingHours: { start: "08:00", end: "22:00" },
    overtimeRate: 1.5,
    status: "Active",
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    name: "Andheri East Cafe",
    address: "456 Chakala Road, Andheri East",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400069",
    phone: "+91 98765 43211",
    email: "andheri@cafepayroll.com",
    workingHours: { start: "07:00", end: "23:00" },
    overtimeRate: 1.5,
    status: "Active",
    createdAt: "2024-02-10"
  },
  {
    id: 3,
    name: "Powai Cafe",
    address: "789 Hiranandani Gardens, Powai",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400076",
    phone: "+91 98765 43212",
    email: "powai@cafepayroll.com",
    workingHours: { start: "08:00", end: "22:00" },
    overtimeRate: 1.5,
    status: "Active",
    createdAt: "2024-03-05"
  }
];

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [locations, setLocations] = useState<Location[]>(defaultLocations);

  const addLocation = (locationData: Omit<Location, 'id' | 'createdAt'>) => {
    const newLocation: Location = {
      ...locationData,
      id: Math.max(...locations.map(l => l.id), 0) + 1,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setLocations([...locations, newLocation]);
  };

  const updateLocation = (id: number, locationData: Partial<Location>) => {
    setLocations(locations.map(location => 
      location.id === id ? { ...location, ...locationData } : location
    ));
  };

  const deleteLocation = (id: number) => {
    setLocations(locations.filter(location => location.id !== id));
  };

  const getLocationById = (id: number) => {
    return locations.find(location => location.id === id);
  };

  return (
    <LocationContext.Provider value={{
      locations,
      addLocation,
      updateLocation,
      deleteLocation,
      getLocationById
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};
