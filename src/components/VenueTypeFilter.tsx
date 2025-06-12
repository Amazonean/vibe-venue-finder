import React from 'react';
import { Button } from '@/components/ui/button';

interface VenueTypeFilterProps {
  selectedTypes: string[];
  onTypeChange: (types: string[]) => void;
}

const venueTypes = [
  'All Types',
  'Clubs',
  'Bars', 
  'Restaurants',
  'Live Music',
  'Lounges',
  'Rooftops',
  'Dance Halls'
];

const VenueTypeFilter: React.FC<VenueTypeFilterProps> = ({ selectedTypes, onTypeChange }) => {
  const handleTypeToggle = (type: string) => {
    if (type === 'All Types') {
      onTypeChange([]);
      return;
    }

    const isSelected = selectedTypes.includes(type);
    if (isSelected) {
      onTypeChange(selectedTypes.filter(t => t !== type));
    } else {
      onTypeChange([...selectedTypes, type]);
    }
  };

  return (
    <div>
      <h4 className="text-sm font-medium text-foreground mb-3">Venue Type</h4>
      <div className="flex flex-wrap gap-2">
        {venueTypes.map((type) => {
          const isSelected = type === 'All Types' ? selectedTypes.length === 0 : selectedTypes.includes(type);
          return (
            <Button
              key={type}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => handleTypeToggle(type)}
              className={`text-xs ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground border-border'}`}
            >
              {type}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default VenueTypeFilter;