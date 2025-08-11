import React from 'react';
import { Play, Pause } from 'lucide-react';

interface VideoPreviewPlayerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  capturedVideo: string;
  isPlaying: boolean;
  onTogglePlayback: () => void;
  onVideoEnded: () => void;
  filterCss?: string;
}

const VideoPreviewPlayer: React.FC<VideoPreviewPlayerProps> = ({
  videoRef,
  capturedVideo,
  isPlaying,
  onTogglePlayback,
  onVideoEnded,
  filterCss
}) => {
  return (
    <>
      <video 
        ref={videoRef}
        src={capturedVideo} 
        className="max-w-full max-h-full object-contain"
        onEnded={onVideoEnded}
        playsInline
        controls={false}
        style={{ filter: filterCss }}
      />
      
      {/* Floating Play/Pause button */}
      <button
        onClick={onTogglePlayback}
        data-no-gesture="true"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-primary/90 rounded-full p-3 hover:bg-primary transition-colors shadow-lg z-20"
      >
        {isPlaying ? (
          <Pause className="h-6 w-6 text-white" />
        ) : (
          <Play className="h-6 w-6 text-white ml-0.5" />
        )}
      </button>
    </>
  );
};

export default VideoPreviewPlayer;