import React, { useRef } from 'react';
import { CameraOverlayProps } from './types';
import { useMediaConfiguration } from './hooks/useMediaConfiguration';
import CameraVideo from './overlay/CameraVideo';
import UnifiedOverlayRenderer from './overlays/UnifiedOverlayRenderer';
import CountdownOverlay from './overlay/CountdownOverlay';
import PosePrompt from './overlay/PosePrompt';
import RecordingIndicator from './overlay/RecordingIndicator';
import CameraButton from './overlay/CameraButton';
import CameraError from './overlay/CameraError';
import ZoomControls from './overlay/ZoomControls';

const CameraOverlay: React.FC<CameraOverlayProps> = ({
  videoRef,
  venueName,
  selectedVibe,
  vibeConfig,
  countdown,
  showPosePrompt,
  cameraError,
  onStartCountdown,
  onStartCamera,
  currentFilter = 'none',
  onFilterChange,
  isRecording = false,
  recordingTime = 0,
  onStartRecording,
  onStopRecording,
  zoomScale = 1,
  onZoomChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { config } = useMediaConfiguration(containerRef);
  
  // Filter swipe gestures are disabled on live camera; only available in previews

  if (cameraError) {
    return <CameraError cameraError={cameraError} onStartCamera={onStartCamera} />;
  }

  return (
    <div 
      ref={containerRef}
      className="relative h-full"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + var(--top-nav-height, 64px))',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + var(--bottom-nav-height, 72px))'
      }}
    >
      <CameraVideo 
        videoRef={videoRef}
        filter={currentFilter}
        zoomScale={zoomScale}
      />
      
      {/* Unified Overlays - Only show when not recording to avoid duplicates */}
      {config && !isRecording && (
        <UnifiedOverlayRenderer
          config={config}
          venueName={venueName}
          selectedVibe={selectedVibe}
          vibeConfig={vibeConfig}
        />
      )}
      
      {/* Interactive Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <CountdownOverlay countdown={countdown} />
        <PosePrompt 
          showPosePrompt={showPosePrompt}
          selectedVibe={selectedVibe}
          vibeConfig={vibeConfig}
        />
        <RecordingIndicator 
          isRecording={isRecording}
          recordingTime={recordingTime}
        />
      </div>

      <CameraButton
        countdown={countdown}
        isRecording={isRecording}
        recordingTime={recordingTime}
        onStartCountdown={onStartCountdown}
        onStartRecording={onStartRecording}
        onStopRecording={onStopRecording}
      />


      {/* Zoom controls */}
      <ZoomControls videoRef={videoRef} zoomScale={zoomScale} onZoomChange={onZoomChange} />
    </div>
  );
};

export default CameraOverlay;