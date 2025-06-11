import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import DistanceFilter from '@/components/DistanceFilter';

interface VenuesFiltersProps {
  locationEnabled: boolean;
  maxDistance: number;
  isFiltersOpen: boolean;
  onToggleFilters: () => void;
  onDistanceChange: (distance: number) => void;
}

const VenuesFilters: React.FC<VenuesFiltersProps> = ({
  locationEnabled,
  maxDistance,
  isFiltersOpen,
  onToggleFilters,
  onDistanceChange
}) => {
  if (!locationEnabled) return null;

  return (
    <>
      <Button
        variant="outline"
        onClick={onToggleFilters}
        className="flex items-center gap-2 mb-4 bg-muted border-none text-foreground"
        size="sm"
      >
        <Filter className="h-4 w-4" />
        Distance Filter ({maxDistance}km)
      </Button>

      {isFiltersOpen && (
        <Card className="mb-4 p-4 bg-muted border-none">
          <DistanceFilter
            maxDistance={maxDistance}
            onDistanceChange={onDistanceChange}
            enabled={locationEnabled}
          />
        </Card>
      )}
    </>
  );
};

export default VenuesFilters;