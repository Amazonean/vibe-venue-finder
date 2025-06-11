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
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors">
              {venue.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3" />
              <span>{venue.address}</span>
            </div>
          </div>
          {showDistance && (
            <Badge variant="secondary" className="ml-2">
              {venue.distance}km
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {venue.description}
        </p>

        {/* Vibe Level */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium text-card-foreground">Vibe:</span>
          <Badge className={getVibeColor(venue.vibeLevel)}>
            {getVibeEmoji(venue.vibeLevel)} {venue.vibeLevel}
          </Badge>
        </div>

        {/* Music Type */}
        <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
          <Music className="h-4 w-4" />
          <span>{venue.musicType}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{venue.voteCount} votes</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Updated {venue.lastUpdated}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button size="sm" className="flex-1">
            Vote on Vibe
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VenueCard;