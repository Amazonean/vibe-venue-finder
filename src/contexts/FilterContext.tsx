import React, { createContext, useContext, useState, useEffect } from 'react';

interface FilterContextType {
  maxDistance: number;
  distanceUnit: 'km' | 'miles';
  selectedVenueTypes: string[];
  selectedVibes: string[];
  isFiltersOpen: boolean;
  setMaxDistance: (distance: number) => void;
  setDistanceUnit: (unit: 'km' | 'miles') => void;
  setSelectedVenueTypes: (types: string[]) => void;
  setSelectedVibes: (vibes: string[]) => void;
  setIsFiltersOpen: (open: boolean) => void;
  clearFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [maxDistance, setMaxDistance] = useState(() => {
    const saved = localStorage.getItem('maxDistance');
    return saved ? parseFloat(saved) : 5;
  });

  const [distanceUnit, setDistanceUnit] = useState<'km' | 'miles'>(() => {
    const saved = localStorage.getItem('distanceUnit');
    return (saved as 'km' | 'miles') || 'km';
  });

  const [selectedVenueTypes, setSelectedVenueTypes] = useState<string[]>(() => {
    const saved = localStorage.getItem('selectedVenueTypes');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedVibes, setSelectedVibes] = useState<string[]>(() => {
    const saved = localStorage.getItem('selectedVibes');
    return saved ? JSON.parse(saved) : [];
  });

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('maxDistance', maxDistance.toString());
  }, [maxDistance]);

  useEffect(() => {
    localStorage.setItem('distanceUnit', distanceUnit);
  }, [distanceUnit]);

  useEffect(() => {
    localStorage.setItem('selectedVenueTypes', JSON.stringify(selectedVenueTypes));
  }, [selectedVenueTypes]);

  useEffect(() => {
    localStorage.setItem('selectedVibes', JSON.stringify(selectedVibes));
  }, [selectedVibes]);

  const handleDistanceUnitChange = (newUnit: 'km' | 'miles') => {
    if (newUnit !== distanceUnit) {
      // Convert distance when changing units
      const convertedDistance = newUnit === 'miles' 
        ? Math.round(maxDistance * 0.621371)  // km to miles
        : Math.round(maxDistance / 0.621371); // miles to km
      setMaxDistance(convertedDistance);
    }
    setDistanceUnit(newUnit);
  };

  const clearFilters = () => {
    setSelectedVenueTypes([]);
    setSelectedVibes([]);
    setMaxDistance(5);
    setDistanceUnit('km');
  };

  const value = {
    maxDistance,
    distanceUnit,
    selectedVenueTypes,
    selectedVibes,
    isFiltersOpen,
    setMaxDistance,
    setDistanceUnit: handleDistanceUnitChange,
    setSelectedVenueTypes,
    setSelectedVibes,
    setIsFiltersOpen,
    clearFilters,
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};