import React from 'react';
import { Play, Pause } from 'lucide-react';

interface VideoPreviewPlayerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  capturedVideo: string;
  isPlaying: boolean;
  onTogglePlayback: () => void;
  onVideoEnded: () => void;
}

const VideoPreviewPlayer: React.FC<VideoPreviewPlayerProps> = ({
  videoRef,
  capturedVideo,
  isPlaying,
  onTogglePlayback,
  onVideoEnded
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
      />
      
      {/* Play/Pause button overlay */}
      <button
        onClick={onTogglePlayback}
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
    </>
  );
};

export default VideoPreviewPlayer;