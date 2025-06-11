import React from 'react';
import { MapPin, Music, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Venue {
  id: number;
  name: string;
  address: string;
  vibeLevel: 'chill' | 'decent' | 'turnt';
  distance: number;
  musicType: string;
  voteCount: number;
  lastUpdated: string;
  description: string;
}

interface VenueCardProps {
  venue: Venue;
  showDistance: boolean;
}

const getVibeColor = (vibe: string) => {
  switch (vibe) {
    case 'chill':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'decent':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'turnt':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

const getVibeEmoji = (vibe: string) => {
  switch (vibe) {
    case 'chill':
      return '😌';
    case 'decent':
      return '🙂';
    case 'turnt':
      return '🔥';
    default:
      return '😐';
  }
};

const VenueCard: React.FC<VenueCardProps> = ({ venue, showDistance }) => {
  return (
    <div className="flex items-stretch justify-between gap-4 rounded-xl bg-muted p-4">
      <div className="flex flex-[2_2_0px] flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="text-foreground text-base font-bold leading-tight">{venue.name}</p>
            {showDistance && (
              <Badge variant="secondary" className="bg-accent/20 text-accent-foreground text-xs">
                {venue.distance}km
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{venue.address}</span>
          </div>
          <p className="text-muted-foreground text-sm font-normal leading-normal line-clamp-2">
            {venue.description}
          </p>
          
          {/* Vibe and Music Type */}
          <div className="flex items-center gap-2 mt-2">
            <Badge className={getVibeColor(venue.vibeLevel)}>
              {getVibeEmoji(venue.vibeLevel)} {venue.vibeLevel}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Music className="h-3 w-3" />
              <span>{venue.musicType}</span>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{venue.voteCount} votes</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{venue.lastUpdated}</span>
            </div>
          </div>
        </div>
        
        <Button
          size="sm"
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-accent text-accent-foreground text-sm font-medium leading-normal w-fit"
        >
          <span className="truncate">Vote on Vibe</span>
        </Button>
      </div>
      
      <div 
        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex-1 min-w-[120px]"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=400&h=300&fit=crop")`
        }}
      />
    </div>
  );
};

export default VenueCard;