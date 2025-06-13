import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Camera } from 'lucide-react';
import SelfieCamera from '@/components/SelfieCamera';

interface VoteDialogProps {
  venueName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onVibeVote: (vibe: 'turnt' | 'chill' | 'quiet') => void;
}

const VoteDialog: React.FC<VoteDialogProps> = ({
  venueName,
  isOpen,
  onOpenChange,
  onVibeVote
}) => {
  const [showThankYou, setShowThankYou] = useState(false);
  const [selectedVibe, setSelectedVibe] = useState<'turnt' | 'chill' | 'quiet' | null>(null);
  const [showSelfieCamera, setShowSelfieCamera] = useState(false);

  const handleVibeVote = (vibe: 'turnt' | 'chill' | 'quiet') => {
    console.log('VoteDialog: handleVibeVote called with vibe:', vibe);
    setSelectedVibe(vibe);
    onVibeVote(vibe);
    setShowThankYou(true);
  };

  const handleClose = () => {
    setShowThankYou(false);
    setSelectedVibe(null);
    setShowSelfieCamera(false);
    onOpenChange(false);
  };

  const handleTakeSelfie = () => {
    setShowSelfieCamera(true);
    onOpenChange(false); // Close the dialog when camera opens
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-6 px-3 text-xs bg-primary text-primary-foreground hover:bg-primary/90">
          Vote
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {showThankYou ? 'Thanks for voting!' : `Vote for the vibe at ${venueName}`}
          </DialogTitle>
        </DialogHeader>
        
        {!showThankYou ? (
          <div className="flex flex-col gap-3 py-4">
            <Button
              onClick={() => handleVibeVote('turnt')}
              className="w-full justify-start gap-3 h-12 bg-primary/20 text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground"
              variant="outline"
            >
              🔥 Turnt
            </Button>
            <Button
              onClick={() => handleVibeVote('chill')}
              className="w-full justify-start gap-3 h-12 bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80"
              variant="outline"
            >
              🙂 Chill
            </Button>
            <Button
              onClick={() => handleVibeVote('quiet')}
              className="w-full justify-start gap-3 h-12 bg-accent/20 text-accent-foreground border border-accent/30 hover:bg-accent hover:text-accent-foreground"
              variant="outline"
            >
              😌 Quiet
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 py-4 text-center">
            <p className="text-muted-foreground">
              Your vote helps others find the perfect vibe! Would you like to take a selfie to share on social media?
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleTakeSelfie}
                className="flex-1 gap-2"
              >
                <Camera className="h-4 w-4" />
                Take Selfie
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1"
              >
                Maybe Later
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
      
      {/* Selfie Camera Component */}
      {selectedVibe && (
        <SelfieCamera
          isOpen={showSelfieCamera}
          onClose={() => setShowSelfieCamera(false)}
          venueName={venueName}
          selectedVibe={selectedVibe}
        />
      )}
    </Dialog>
  );
};

export default VoteDialog;