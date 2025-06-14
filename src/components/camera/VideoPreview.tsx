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
        // Fallback for browsers that don't support native sharing
        saveToDevice();
        toast({
          title: "Share Not Supported",
          description: "Video saved to device instead. You can manually share it from your gallery.",
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
          muted
        />
        
        {/* Play/Pause button overlay */}
        <button
          onClick={togglePlayback}
          className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
        >
          <div className="bg-white/90 rounded-full p-4 hover:bg-white transition-colors">
            {isPlaying ? (
              <Pause className="h-8 w-8 text-black" />
            ) : (
              <Play className="h-8 w-8 text-black ml-1" />
            )}
          </div>
        </button>
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
            onClick={shareVideo}
            className="flex-1 gap-2"
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
        </div>
        
        <Button
          onClick={onRetakeVideo}
          variant="ghost"
          className="w-full text-white hover:bg-white/20"
        >
          Retake Video
        </Button>
      </div>
    </div>
  );
};

export default VideoPreview;