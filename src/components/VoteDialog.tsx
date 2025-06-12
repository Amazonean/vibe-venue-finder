import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface VoteDialogProps {
  venueName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onVibeVote: (vibe: 'turnt' | 'decent' | 'chill') => void;
}

const VoteDialog: React.FC<VoteDialogProps> = ({
  venueName,
  isOpen,
  onOpenChange,
  onVibeVote
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-6 px-3 text-xs bg-primary text-primary-foreground hover:bg-primary/90">
          Vote
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Vote for the vibe at {venueName}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-4">
          <Button
            onClick={() => onVibeVote('turnt')}
            className="w-full justify-start gap-3 h-12 bg-primary/20 text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground"
            variant="outline"
          >
            🔥 Turnt
          </Button>
          <Button
            onClick={() => onVibeVote('decent')}
            className="w-full justify-start gap-3 h-12 bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80"
            variant="outline"
          >
            🙂 Decent
          </Button>
          <Button
            onClick={() => onVibeVote('chill')}
            className="w-full justify-start gap-3 h-12 bg-accent/20 text-accent-foreground border border-accent/30 hover:bg-accent hover:text-accent-foreground"
            variant="outline"
          >
            😌 Chill
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoteDialog;