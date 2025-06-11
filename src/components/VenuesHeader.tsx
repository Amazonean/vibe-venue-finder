import React from 'react';
import { Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VenuesHeaderProps {
  locationEnabled: boolean;
  onRequestLocation: () => void;
}

const VenuesHeader: React.FC<VenuesHeaderProps> = ({ locationEnabled, onRequestLocation }) => {
  return (
    <div className="flex items-center justify-between pb-2">
      <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pl-12">
        Nightlife
      </h2>
      <div className="flex w-12 items-center justify-end">
        {!locationEnabled && (
          <Button 
            onClick={onRequestLocation}
            variant="ghost" 
            size="sm"
            className="flex items-center gap-2 text-white p-0"
          >
            <Navigation className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default VenuesHeader;