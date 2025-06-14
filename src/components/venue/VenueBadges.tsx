import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Venue } from './types';

interface VenueBadgesProps {
  venue: Venue;
}

const getVibeColor = (vibe: string) => {
  switch (vibe) {
    case 'quiet':
      return 'bg-accent/20 text-accent-foreground border border-accent/30';
    case 'chill':
      return 'bg-secondary text-secondary-foreground border border-border';
    case 'turnt':
      return 'bg-primary/20 text-primary border border-primary/30';
    default:
      return 'bg-muted text-muted-foreground border border-border';
  }
};

const getVibeEmoji = (vibe: string) => {
  switch (vibe) {
    case 'quiet':
      return '😌';
    case 'chill':
      return '🙂';
    case 'turnt':
      return '🔥';
    default:
      return '😐';
  }
};

const VenueBadges: React.FC<VenueBadgesProps> = ({ venue }) => {
  return (
    <div className="flex items-center gap-2 my-2">
      <Badge className={`${getVibeColor(venue.vibeLevel)} text-xs font-medium`}>
        {getVibeEmoji(venue.vibeLevel)} {venue.vibeLevel}
      </Badge>
      <Badge variant="outline" className="text-xs border-border bg-background/50">
        {venue.venueType}
      </Badge>
    </div>
  );
};

export default VenueBadges;