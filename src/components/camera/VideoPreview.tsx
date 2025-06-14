import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share, Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { VibeType, VibeConfiguration } from './VibeConfig';

interface VideoPreviewProps {
  capturedVideo: string;
  venueName: string;
  selectedVibe: VibeType;
  vibeConfig: Record<VibeType, VibeConfiguration>;
  onRetakeVideo: () => void;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  capturedVideo,
  venueName,
  selectedVibe,
  vibeConfig,
  onRetakeVideo
}) => {
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  const saveToDevice = () => {
    const link = document.createElement('a');
    link.download = `vibe-video-${venueName.replace(/\s+/g, '-')}-${selectedVibe}.webm`;
    link.href = capturedVideo;
    link.click();

    toast({
      title: "Video Saved",
      description: "Your vibe video has been saved to your device!",
    });
  };

  const shareVideo = async () => {
    try {
      // Convert data URL to blob
      const response = await fetch(capturedVideo);
      const blob = await response.blob();
      const file = new File([blob], `vibe-video-${selectedVibe}.webm`, { type: 'video/webm' });

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
          title: "Video Shared",
          description: "Your vibe video has been shared!",
        });
      } else {
        // Use Web Share API or create a custom share dialog
        const shareText = includeHashtags 
          ? `Vibe check at ${venueName}! ${vibeConfig[selectedVibe].hashtags.join(' ')}`
          : `Vibe check at ${venueName}!`;
        
        const shareUrl = URL.createObjectURL(blob);
        
        // Try to open native share dialog
        if (navigator.share) {
          try {
            await navigator.share({
              title: `Vibe Check at ${venueName}`,
              text: shareText,
              url: shareUrl
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
              description: "Video caption copied to clipboard. You can manually share the downloaded video.",
            });
          } catch (clipboardError) {
            console.log('Clipboard API failed');
          }
        }
        
        // Download as last resort
        saveToDevice();
        toast({
          title: "Video Ready to Share",
          description: "Video downloaded. You can now share it manually from your device.",
        });
      }
    } catch (error) {
      console.error('Share error:', error);
      saveToDevice();
      toast({
        title: "Share Failed",
        description: "Video saved to device instead.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col h-screen">
      {/* Video container that shrinks as needed */}
      <div className="flex-1 flex items-center justify-center relative min-h-0 p-2">
        <video 
          ref={videoRef}
          src={capturedVideo} 
          className="max-w-full max-h-full object-contain"
          onEnded={handleVideoEnded}
          playsInline
          controls={false}
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
        
        {/* Play/Pause button overlay */}
        <button
          onClick={togglePlayback}
          className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors z-20"
        >
          <div className="bg-primary/90 rounded-full p-3 hover:bg-primary transition-colors shadow-lg">
            {isPlaying ? (
              <Pause className="h-6 w-6 text-white" />
            ) : (
              <Play className="h-6 w-6 text-white ml-0.5" />
            )}
          </div>
        </button>
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
            onClick={shareVideo}
            className="flex-1 gap-1 h-8 text-xs"
            size="sm"
          >
            <Share className="h-3 w-3" />
            Share
          </Button>
        </div>
        
        <Button
          onClick={onRetakeVideo}
          variant="ghost"
          className="w-full text-white hover:bg-white/20 h-8 text-xs"
          size="sm"
        >
          Retake Video
        </Button>
      </div>
    </div>
  );
};

export default VideoPreview;