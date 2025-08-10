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
  const milesMarks = [1, 3, 5, 7, 10];
  const kmMarks = [1.6, 4.8, 8.0, 11.3, 16.1];
  const marks = unit === 'miles' ? milesMarks : kmMarks;

  const findNearest = (val: number, candidates: number[]) => {
    return candidates.reduce((prev, curr) => Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev);
  };

  const handleDistanceChange = (value: number[]) => {
    const nearest = findNearest(value[0], marks);
    onDistanceChange(Number(nearest.toFixed(1)));
  };

  const handleUnitSwitch = (newUnit: 'km' | 'miles') => {
    if (newUnit === unit) return;
    const converted = newUnit === 'miles' ? maxDistance / 1.609 : maxDistance * 1.609;
    const targetMarks = newUnit === 'miles' ? milesMarks : kmMarks;
    const snapped = findNearest(converted, targetMarks);
    onUnitChange(newUnit);
    onDistanceChange(Number(snapped.toFixed(1)));
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
            onClick={() => handleUnitSwitch('km')}
            className="text-xs px-2 py-1"
          >
            km
          </Button>
          <Button
            variant={unit === 'miles' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleUnitSwitch('miles')}
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
          max={marks[marks.length - 1]}
          min={marks[0]}
          step={unit === 'miles' ? 1 : 0.1}
          className="w-full"
        />
        <div className="flex justify-between text-[11px] text-muted-foreground">
          {marks.map((m) => (
            <span key={m}>{m}{unit === 'miles' ? '' : ''}</span>
          ))}
        </div>
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