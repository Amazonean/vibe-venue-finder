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
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-center justify-center relative bg-black">
        <video 
          ref={videoRef}
          src={capturedVideo} 
          className="max-w-full max-h-full object-contain"
          onEnded={handleVideoEnded}
          playsInline
          controls={false}
        />
        
        {/* Play/Pause button overlay */}
        <button
          onClick={togglePlayback}
          className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
        >
          <div className="bg-primary/90 rounded-full p-4 hover:bg-primary transition-colors shadow-lg">
            {isPlaying ? (
              <Pause className="h-8 w-8 text-white" />
            ) : (
              <Play className="h-8 w-8 text-white ml-1" />
            )}
          </div>
        </button>
      </div>
      
      <div className="p-4 bg-black/80 space-y-3" style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}>
        {/* Hashtag toggle */}
        <div className="flex items-center justify-center gap-2">
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
          <div className="p-2 bg-gray-900/50 rounded-lg">
            <p className="text-xs text-gray-300 mb-1">Preview hashtags:</p>
            <p className="text-sm text-blue-300">
              {vibeConfig[selectedVibe].hashtags.join(' ')}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            onClick={saveToDevice}
            className="flex-1 gap-2"
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4" />
            Save
          </Button>
          <Button
            onClick={shareVideo}
            className="flex-1 gap-2"
            size="sm"
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
        </div>
        
        <Button
          onClick={onRetakeVideo}
          variant="ghost"
          className="w-full text-white hover:bg-white/20"
          size="sm"
        >
          Retake Video
        </Button>
      </div>
    </div>
  );
};

export default VideoPreview;