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
    <div className="fixed inset-0 bg-black flex flex-col h-screen">
      {/* Photo container that shrinks as needed */}
      <div className="flex-1 flex items-center justify-center min-h-0 p-2 relative">
        <img 
          src={capturedImage} 
          alt="Captured selfie" 
          className="max-w-full max-h-full object-contain"
        />
        
        {/* Overlay elements positioned exactly like in camera view */}
        <div className="absolute inset-2 pointer-events-none">
          {/* Venue Name Overlay */}
          <div className="absolute top-8 left-0 right-0 text-center px-4 z-10">
            <div className="inline-block bg-black/40 px-4 py-2 rounded-lg max-w-[90%]">
              <h1 
                className="text-2xl sm:text-3xl font-bold uppercase drop-shadow-lg leading-tight"
                style={{ 
                  color: '#C26AF5',
                  textShadow: '0 0 10px rgba(194, 106, 245, 0.5), 0 2px 4px rgba(0, 0, 0, 0.8)',
                  wordWrap: 'break-word',
                  hyphens: 'auto'
                }}
              >
                {venueName}
              </h1>
            </div>
          </div>

          {/* Vibe Badge Overlay */}
          <div className="absolute top-18 left-4">
            <img 
              src={vibeConfig[selectedVibe].badge === 'Turnt' ? '/lovable-uploads/20a93d55-cfbc-417d-b442-a073caa5158f.png' :
                   vibeConfig[selectedVibe].badge === 'Chill' ? '/lovable-uploads/4b5069a8-223b-47a6-b22b-5439eade3e91.png' :
                   '/lovable-uploads/750b5511-5654-47b1-93a5-1bb9063ad60c.png'}
              alt={`${selectedVibe} vibe`}
              className="w-56 h-auto drop-shadow-lg"
              style={{
                filter: 'drop-shadow(2px 2px 8px rgba(0, 0, 0, 0.8))'
              }}
            />
          </div>

          {/* TurntUp Logo Overlay */}
          <div className="absolute bottom-8 right-4">
            <img 
              src="/lovable-uploads/4798e35a-824c-4ddc-9916-74b59aac299d.png"
              alt="TurntUp Logo"
              className="w-20 h-auto drop-shadow-lg"
              style={{
                filter: 'drop-shadow(2px 2px 8px rgba(0, 0, 0, 0.8))'
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Fixed bottom panel with controls */}
      <div className="flex-shrink-0 p-3 bg-black/90 space-y-2 border-t border-gray-800" style={{ paddingBottom: 'env(safe-area-inset-bottom, 12px)' }}>
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