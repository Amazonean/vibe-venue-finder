import React from 'react';
import { CameraOverlayProps, filters } from './types';
import { useFilterGestures } from './hooks/useFilterGestures';
import CameraVideo from './overlay/CameraVideo';
import VenueNameOverlay from './overlay/VenueNameOverlay';
import VibeBadgeOverlay from './overlay/VibeBadgeOverlay';
import LogoOverlay from './overlay/LogoOverlay';
import FilterNameDisplay from './overlay/FilterNameDisplay';
import CountdownOverlay from './overlay/CountdownOverlay';
import PosePrompt from './overlay/PosePrompt';
import RecordingIndicator from './overlay/RecordingIndicator';
import CameraButton from './overlay/CameraButton';
import SwipeHint from './overlay/SwipeHint';
import CameraError from './overlay/CameraError';

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
  currentFilter = 'Default',
  onFilterChange,
  isRecording = false,
  recordingTime = 0,
  onStartRecording,
  onStopRecording
}) => {
  const {
    currentFilterIndex,
    showFilterName,
    handleTouchStart,
    handleTouchMove,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useFilterGestures(currentFilter, onFilterChange);

  if (cameraError) {
    return <CameraError cameraError={cameraError} onStartCamera={onStartCamera} />;
  }

  return (
    <div 
      className="relative h-full cursor-grab active:cursor-grabbing"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <CameraVideo 
        videoRef={videoRef}
        currentFilterIndex={currentFilterIndex}
        filters={filters}
      />
      
      {/* Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <VenueNameOverlay venueName={venueName} />
        <VibeBadgeOverlay selectedVibe={selectedVibe} />
        <LogoOverlay />
        <FilterNameDisplay 
          showFilterName={showFilterName}
          currentFilterIndex={currentFilterIndex}
          filters={filters}
        />
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

      <SwipeHint 
        countdown={countdown}
        showPosePrompt={showPosePrompt}
        isRecording={isRecording}
      />
    </div>
  );
};

export default CameraOverlay;