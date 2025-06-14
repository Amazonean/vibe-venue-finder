import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { VibeType } from './VibeConfig';
import { useCamera } from './hooks/useCamera';
import { useVideoRecording } from './hooks/useVideoRecording';
import { usePhotoCapture } from './hooks/usePhotoCapture';
import CameraOverlay from './CameraOverlay';
import { getVibeConfig } from './VibeConfig';

interface CameraInterfaceProps {
  venueName: string;
  selectedVibe: VibeType;
  onPhotoCapture: (imageDataUrl: string) => void;
  onClose: () => void;
}

const CameraInterface: React.FC<CameraInterfaceProps> = ({
  venueName,
  selectedVibe,
  onPhotoCapture,
  onClose
}) => {
  const [currentFilter, setCurrentFilter] = useState('none');
  const vibeConfig = getVibeConfig(venueName);

  const { 
    videoRef, 
    streamRef, 
    cameraError, 
    startCamera, 
    stopCamera 
  } = useCamera();

  const { 
    isRecording, 
    recordingTime, 
    startVideoRecording, 
    stopVideoRecording 
  } = useVideoRecording(venueName, selectedVibe);

  const {
    canvasRef,
    countdown,
    showPosePrompt,
    startCountdown,
    handleCapturePhoto
  } = usePhotoCapture();

  const handleStartRecording = () => {
    startVideoRecording(streamRef);
  };

  const handleCaptureComplete = async () => {
    const imageDataUrl = await handleCapturePhoto(
      videoRef,
      venueName,
      selectedVibe,
      vibeConfig,
      currentFilter,
      stopCamera
    );
    
    if (imageDataUrl) {
      onPhotoCapture(imageDataUrl);
    }
  };

  const handleStartCountdown = () => {
    startCountdown(handleCaptureComplete);
  };

  useEffect(() => {
    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      startCamera();
    }, 100);
    return () => clearTimeout(timer);
  }, [startCamera]);

  return (
    <div className="relative h-full">
      {/* Cancel button */}
      <Button
        onClick={onClose}
        variant="ghost"
        className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 px-4"
      >
        Cancel
      </Button>

      <CameraOverlay
        videoRef={videoRef}
        venueName={venueName}
        selectedVibe={selectedVibe}
        vibeConfig={vibeConfig}
        countdown={countdown}
        showPosePrompt={showPosePrompt}
        cameraError={cameraError}
        onStartCountdown={handleStartCountdown}
        onStartCamera={startCamera}
        currentFilter={currentFilter}
        onFilterChange={setCurrentFilter}
        isRecording={isRecording}
        recordingTime={recordingTime}
        onStartRecording={handleStartRecording}
        onStopRecording={stopVideoRecording}
      />

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraInterface;