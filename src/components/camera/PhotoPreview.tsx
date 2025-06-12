import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { VibeType, VibeConfiguration } from './VibeConfig';

interface PhotoPreviewProps {
  capturedImage: string;
  venueName: string;
  selectedVibe: VibeType;
  vibeConfig: Record<VibeType, VibeConfiguration>;
  onRetakePhoto: () => void;
}

const PhotoPreview: React.FC<PhotoPreviewProps> = ({
  capturedImage,
  venueName,
  selectedVibe,
  vibeConfig,
  onRetakePhoto
}) => {
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const { toast } = useToast();

  const saveToDevice = () => {
    const link = document.createElement('a');
    link.download = `vibe-selfie-${venueName.replace(/\s+/g, '-')}-${selectedVibe}.jpg`;
    link.href = capturedImage;
    link.click();

    toast({
      title: "Photo Saved",
      description: "Your vibe selfie has been saved to your device!",
    });
  };

  const sharePhoto = async () => {
    try {
      // Convert data URL to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], `vibe-selfie-${selectedVibe}.jpg`, { type: 'image/jpeg' });

      const shareData: ShareData = {
        files: [file],
        title: `Vibe Check at ${venueName}`,
      };

      if (includeHashtags) {
        shareData.text = `Vibe check at ${venueName}! ${vibeConfig[selectedVibe].hashtags.join(' ')}`;
      }

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({
          title: "Photo Shared",
          description: "Your vibe selfie has been shared!",
        });
      } else {
        // Fallback for browsers that don't support native sharing
        saveToDevice();
        toast({
          title: "Share Not Supported",
          description: "Photo saved to device instead. You can manually share it from your gallery.",
        });
      }
    } catch (error) {
      console.error('Share error:', error);
      saveToDevice();
      toast({
        title: "Share Failed",
        description: "Photo saved to device instead.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-center justify-center">
        <img 
          src={capturedImage} 
          alt="Captured selfie" 
          className="max-w-full max-h-full object-contain"
        />
      </div>
      
      <div className="p-6 bg-black/80">
        {/* Hashtag toggle */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <label className="flex items-center gap-2 text-white text-sm">
            <input
              type="checkbox"
              checked={includeHashtags}
              onChange={(e) => setIncludeHashtags(e.target.checked)}
              className="rounded"
            />
            Add vibe hashtags to your post?
          </label>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            onClick={saveToDevice}
            className="flex-1 gap-2"
            variant="outline"
          >
            <Download className="h-4 w-4" />
            Save to Device
          </Button>
          <Button
            onClick={sharePhoto}
            className="flex-1 gap-2"
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
        </div>
        
        <Button
          onClick={onRetakePhoto}
          variant="ghost"
          className="w-full mt-3 text-white hover:bg-white/20"
        >
          Retake Photo
        </Button>
      </div>
    </div>
  );
};

export default PhotoPreview;