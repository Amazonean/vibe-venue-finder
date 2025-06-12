import React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ProximityFilter from '@/components/ProximityFilter';
import VenueTypeFilter from '@/components/VenueTypeFilter';
import VibeFilter from '@/components/VibeFilter';

interface VenuesFiltersProps {
  locationEnabled: boolean;
  maxDistance: number;
  distanceUnit: 'km' | 'miles';
  selectedVenueTypes: string[];
  selectedVibes: string[];
  isFiltersOpen: boolean;
  onToggleFilters: () => void;
  onDistanceChange: (distance: number) => void;
  onDistanceUnitChange: (unit: 'km' | 'miles') => void;
  onVenueTypesChange: (types: string[]) => void;
  onVibesChange: (vibes: string[]) => void;
  onClearFilters: () => void;
}

const VenuesFilters: React.FC<VenuesFiltersProps> = ({
  locationEnabled,
  maxDistance,
  distanceUnit,
  selectedVenueTypes,
  selectedVibes,
  isFiltersOpen,
  onToggleFilters,
  onDistanceChange,
  onDistanceUnitChange,
  onVenueTypesChange,
  onVibesChange,
  onClearFilters
}) => {
  const hasActiveFilters = selectedVenueTypes.length > 0 || selectedVibes.length > 0;
  const filterCount = selectedVenueTypes.length + selectedVibes.length;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          onClick={onToggleFilters}
          className="flex items-center gap-2 bg-muted border-none text-foreground"
          size="sm"
        >
          <Filter className="h-4 w-4" />
          Filters {filterCount > 0 && `(${filterCount})`}
        </Button>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
            size="sm"
          >
            <X className="h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      {isFiltersOpen && (
        <Card className="mb-4 p-4 bg-muted border-none">
          <div className="space-y-6">
            <ProximityFilter
              maxDistance={maxDistance}
              unit={distanceUnit}
              onDistanceChange={onDistanceChange}
              onUnitChange={onDistanceUnitChange}
              enabled={locationEnabled}
            />
            
            <Separator className="bg-border" />
            
            <VenueTypeFilter
              selectedTypes={selectedVenueTypes}
              onTypeChange={onVenueTypesChange}
            />
            
            <Separator className="bg-border" />
            
            <VibeFilter
              selectedVibes={selectedVibes}
              onVibeChange={onVibesChange}
            />
          </div>
        </Card>
      )}
    </>
  );
};

export default VenuesFilters;