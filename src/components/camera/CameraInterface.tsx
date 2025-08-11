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
  onVideoCapture: (videoDataUrl: string) => void;
  onClose: () => void;
}

const CameraInterface: React.FC<CameraInterfaceProps> = ({
  venueName,
  selectedVibe,
  onPhotoCapture,
  onVideoCapture,
  onClose
}) => {
  const [currentFilter, setCurrentFilter] = useState('none');
  const [zoomScale, setZoomScale] = useState(1);
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
  } = useVideoRecording(venueName, selectedVibe, onVideoCapture);

  const {
    canvasRef,
    countdown,
    showPosePrompt,
    startCountdown,
    handleCapturePhoto
  } = usePhotoCapture();

  const handleStartRecording = () => {
    startVideoRecording(streamRef, videoRef, currentFilter, vibeConfig, zoomScale);
  };

  const handleCaptureComplete = async () => {
    const imageDataUrl = await handleCapturePhoto(
      videoRef,
      venueName,
      selectedVibe,
      vibeConfig,
      currentFilter,
      stopCamera,
      zoomScale
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
        variant="outline"
        data-no-gesture="true"
        aria-label="Cancel camera"
        className="absolute left-4 z-50 pointer-events-auto text-white border-white/50 hover:bg-white/20 px-4"
        style={{ bottom: 'calc(var(--bottom-nav-height, 72px) + 8px)' }}
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
        zoomScale={zoomScale}
        onZoomChange={setZoomScale}
      />

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraInterface;