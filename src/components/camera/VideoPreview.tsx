import React from 'react';
import { VibeType, VibeConfiguration } from './VibeConfig';
import VideoPreviewOverlays from './preview/VideoPreviewOverlays';
import VideoPreviewControls from './preview/VideoPreviewControls';
import VideoPreviewPlayer from './preview/VideoPreviewPlayer';
import { useVideoPreview } from './preview/hooks/useVideoPreview';
import { useEnhancedFilterGestures } from './hooks/useEnhancedFilterGestures';
import FilterNameDisplay from './overlay/FilterNameDisplay';

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
  const {
    includeHashtags,
    setIncludeHashtags,
    isPlaying,
    videoRef,
    togglePlayback,
    handleVideoEnded,
    saveToDevice,
    shareVideo
  } = useVideoPreview(capturedVideo, venueName, selectedVibe, vibeConfig);

  const gesture = useEnhancedFilterGestures('none', () => {});

  return (
    <div className="fixed inset-0 bg-black flex flex-col h-screen" style={{ paddingTop: 'calc(env(safe-area-inset-top) + var(--top-nav-height, 64px) + 12px)' }}>
      {/* Video container that shrinks as needed */}
      <div className="flex-1 flex items-center justify-center relative min-h-0 p-2" {...gesture.gestureHandlers}>
        <VideoPreviewPlayer
          videoRef={videoRef}
          capturedVideo={capturedVideo}
          isPlaying={isPlaying}
          onTogglePlayback={togglePlayback}
          onVideoEnded={handleVideoEnded}
          filterCss={gesture.currentFilter.cssFilter}
        />
        <FilterNameDisplay showFilterName={gesture.showFilterName} filterName={gesture.currentFilter.name} />
      </div>
      
      <VideoPreviewControls
        includeHashtags={includeHashtags}
        setIncludeHashtags={setIncludeHashtags}
        selectedVibe={selectedVibe}
        vibeConfig={vibeConfig}
        onSave={saveToDevice}
        onShare={shareVideo}
        onRetake={onRetakeVideo}
      />
    </div>
  );
};

export default VideoPreview;