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
        // Use Web Share API or create a custom share dialog
        const shareText = includeHashtags 
          ? `Vibe check at ${venueName}! ${vibeConfig[selectedVibe].hashtags.join(' ')}`
          : `Vibe check at ${venueName}!`;
        
        // Try to open native share dialog
        if (navigator.share) {
          try {
            await navigator.share({
              title: `Vibe Check at ${venueName}`,
              text: shareText,
              url: capturedImage
            });
            toast({
              title: "Share Dialog Opened",
              description: "Choose your preferred sharing method.",
            });
            return;
          } catch (shareError) {
            console.log('Web Share API failed, using fallback');
          }
        }
        
        // Fallback: Copy to clipboard and show message
        if (navigator.clipboard) {
          try {
            await navigator.clipboard.writeText(shareText);
            toast({
              title: "Text Copied",
              description: "Photo caption copied to clipboard. You can manually share the downloaded photo.",
            });
          } catch (clipboardError) {
            console.log('Clipboard API failed');
          }
        }
        
        // Download as last resort
        saveToDevice();
        toast({
          title: "Photo Ready to Share",
          description: "Photo downloaded. You can now share it manually from your device.",
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
      
      <div className="p-6 bg-black/80 safe-area-bottom">
        {/* Hashtag toggle */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <label className="flex items-center gap-2 text-white text-sm">
            <input
              type="checkbox"
              checked={includeHashtags}
              onChange={(e) => setIncludeHashtags(e.target.checked)}
              className="w-4 h-4 text-primary bg-gray-800 border-gray-600 rounded focus:ring-primary focus:ring-2"
            />
            Add vibe hashtags to your post?
          </label>
        </div>

        {/* Preview hashtags */}
        {includeHashtags && (
          <div className="mb-4 p-3 bg-gray-900/50 rounded-lg">
            <p className="text-xs text-gray-300 mb-1">Preview hashtags:</p>
            <p className="text-sm text-blue-300">
              {vibeConfig[selectedVibe].hashtags.join(' ')}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 mb-3">
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
          className="w-full text-white hover:bg-white/20"
        >
          Retake Selfie
        </Button>
      </div>
    </div>
  );
};

export default PhotoPreview;