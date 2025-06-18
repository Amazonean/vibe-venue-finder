import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface ProximityFilterProps {
  maxDistance: number;
  unit: 'km' | 'miles';
  onDistanceChange: (distance: number) => void;
  onUnitChange: (unit: 'km' | 'miles') => void;
  enabled: boolean;
}

const ProximityFilter: React.FC<ProximityFilterProps> = ({
  maxDistance,
  unit,
  onDistanceChange,
  onUnitChange,
  enabled
}) => {
  const maxValue = unit === 'km' ? 50 : 30;

  const handleDistanceChange = (value: number[]) => {
    onDistanceChange(value[0]);
  };

  if (!enabled) {
    return (
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">Distance</h4>
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Enable location or search for a place to filter by distance
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-foreground">Distance</h4>
        <div className="flex gap-1">
          <Button
            variant={unit === 'km' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onUnitChange('km')}
            className="text-xs px-2 py-1"
          >
            km
          </Button>
          <Button
            variant={unit === 'miles' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onUnitChange('miles')}
            className="text-xs px-2 py-1"
          >
            mi
          </Button>
        </div>
      </div>
      
      <div className="space-y-3">
        <Slider
          value={[maxDistance]}
          onValueChange={handleDistanceChange}
          max={maxValue}
          min={1}
          step={1}
          className="w-full"
        />
        <div className="text-center">
          <span className="text-sm text-muted-foreground">
            Within {maxDistance} {unit}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProximityFilter;