import React, { createContext, useContext, useState, useEffect } from 'react';

interface LocationContextType {
  locationEnabled: boolean;
  userLocation: { lat: number; lng: number } | null;
  setLocationEnabled: (enabled: boolean) => void;
  setUserLocation: (location: { lat: number; lng: number } | null) => void;
  requestLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locationEnabled, setLocationEnabled] = useState(() => {
    return localStorage.getItem('locationEnabled') === 'true';
  });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(() => {
    const saved = localStorage.getItem('userLocation');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('locationEnabled', locationEnabled.toString());
  }, [locationEnabled]);

  useEffect(() => {
    if (userLocation) {
      localStorage.setItem('userLocation', JSON.stringify(userLocation));
    } else {
      localStorage.removeItem('userLocation');
    }
  }, [userLocation]);

  const requestLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocationEnabled(true);
          setUserLocation(location);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationEnabled(false);
          setUserLocation(null);
        }
      );
    }
  };

  // Check if geolocation is available and verify permission on mount
  useEffect(() => {
    if (locationEnabled && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
        },
        () => {
          // If we can't get location, reset the state
          setLocationEnabled(false);
          setUserLocation(null);
        },
        { timeout: 5000 }
      );
    }
  }, []);

  const value = {
    locationEnabled,
    userLocation,
    setLocationEnabled,
    setUserLocation,
    requestLocation,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};