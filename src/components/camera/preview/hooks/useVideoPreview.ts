import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { VibeType, VibeConfiguration } from '../../VibeConfig';

export const useVideoPreview = (
  capturedVideo: string,
  venueName: string,
  selectedVibe: VibeType,
  vibeConfig: Record<VibeType, VibeConfiguration>
) => {
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

  return {
    includeHashtags,
    setIncludeHashtags,
    isPlaying,
    videoRef,
    togglePlayback,
    handleVideoEnded,
    saveToDevice,
    shareVideo
  };
};