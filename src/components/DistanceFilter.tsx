import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface DistanceFilterProps {
  maxDistance: number;
  onDistanceChange: (distance: number) => void;
  enabled: boolean;
}

const DistanceFilter: React.FC<DistanceFilterProps> = ({ 
  maxDistance, 
  onDistanceChange, 
  enabled 
}) => {
  if (!enabled) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">
          Enable location access to use distance filtering
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Maximum Distance</Label>
        <span className="text-sm text-muted-foreground">{maxDistance}km</span>
      </div>
      <Slider
        value={[maxDistance]}
        onValueChange={(value) => onDistanceChange(value[0])}
        max={20}
        min={1}
        step={0.5}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>1km</span>
        <span>20km</span>
      </div>
    </div>
  );
};

export default DistanceFilter;