import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  onClose: () => void;
}

const PhotoPreview: React.FC<PhotoPreviewProps> = ({
  capturedImage,
  venueName,
  selectedVibe,
  vibeConfig,
  onRetakePhoto,
  onClose
}) => {
const [includeHashtags, setIncludeHashtags] = useState(true);
const { toast } = useToast();
const navigate = useNavigate();

const saveToDevice = () => {
  const link = document.createElement('a');
  link.download = `vibe-selfie-${venueName.replace(/\s+/g, '-')}-${selectedVibe}.jpg`;
  link.href = capturedImage;
  link.click();

  toast({
    title: 'Photo Saved',
    description: 'Your vibe selfie has been saved to your device!',
  });

  // Close the camera overlay and return the user to the venues page
  // Give a brief moment for the toast and download to trigger
  setTimeout(() => {
    try { onClose(); } catch {}
    try { navigate('/venues'); } catch {}
  }, 250);
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
    <div className="fixed inset-0 bg-black flex flex-col h-screen">
      {/* Photo container that shrinks as needed */}
      <div className="flex-1 flex items-center justify-center min-h-0 p-2 relative">
        <img 
          src={capturedImage} 
          alt="Captured selfie" 
          className="max-w-full max-h-full object-contain"
        />
        
        {/* Note: Overlays are already embedded in the captured image */}
      </div>
      
      {/* Fixed bottom panel with controls */}
      <div className="flex-shrink-0 p-3 bg-black/90 space-y-2 border-t border-gray-800" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 12px) + 64px)' }}>
        {/* Hashtag toggle */}
        <div className="flex items-center justify-center">
          <label className="flex items-center gap-2 text-white text-xs">
            <input
              type="checkbox"
              checked={includeHashtags}
              onChange={(e) => setIncludeHashtags(e.target.checked)}
              className="w-3 h-3 text-primary bg-gray-800 border-gray-600 rounded focus:ring-primary focus:ring-1"
            />
            Add vibe hashtags?
          </label>
        </div>

        {/* Preview hashtags - collapsible */}
        {includeHashtags && (
          <div className="p-2 bg-gray-900/50 rounded text-center">
            <p className="text-xs text-blue-300 leading-tight">
              {vibeConfig[selectedVibe].hashtags.join(' ')}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            onClick={saveToDevice}
            className="flex-1 gap-1 h-8 text-xs"
            variant="outline"
            size="sm"
          >
            <Download className="h-3 w-3" />
            Save
          </Button>
          <Button
            onClick={sharePhoto}
            className="flex-1 gap-1 h-8 text-xs"
            size="sm"
          >
            <Share className="h-3 w-3" />
            Share
          </Button>
        </div>
        
        <Button
          onClick={onRetakePhoto}
          variant="ghost"
          className="w-full text-white hover:bg-white/20 h-8 text-xs"
          size="sm"
        >
          Retake Selfie
        </Button>
      </div>
    </div>
  );
};

export default PhotoPreview;