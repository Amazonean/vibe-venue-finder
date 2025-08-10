import React from 'react';
import { Music, Users } from 'lucide-react';
import VoteDialog from '@/components/VoteDialog';
import { Venue } from './types';

interface VenueStatsProps {
  venue: Venue;
  isDialogOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onVibeVote: (vibe: 'turnt' | 'chill' | 'quiet') => Promise<boolean>;
  hasActiveVote?: boolean;
  remainingTime?: string;
  activeVoteVibe?: 'turnt' | 'chill' | 'quiet' | null;
}

const VenueStats: React.FC<VenueStatsProps> = ({
  venue,
  isDialogOpen,
  onOpenChange,
  onVibeVote,
  hasActiveVote,
  remainingTime,
  activeVoteVibe
}) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Music className="h-3 w-3" />
          <span>{venue.musicType}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          <span>{venue.voteCount}</span>
        </div>
      </div>
      <VoteDialog 
        venueName={venue.name}
        isOpen={isDialogOpen}
        onOpenChange={onOpenChange}
        onVibeVote={onVibeVote}
        hasActiveVote={hasActiveVote}
        remainingTime={remainingTime}
        activeVoteVibe={activeVoteVibe}
      />
    </div>
  );
};

export default VenueStats;