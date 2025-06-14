import { useRef, useState } from 'react';
import { capturePhoto } from '../utils/photoCapture';
import { VibeType, VibeConfiguration } from '../VibeConfig';

export const usePhotoCapture = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showPosePrompt, setShowPosePrompt] = useState(false);

  const startCountdown = (onCaptureComplete: () => void) => {
    setShowPosePrompt(true);
    setTimeout(() => setShowPosePrompt(false), 2000);
    
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(timer);
          setTimeout(onCaptureComplete, 100);
          return null;
        }
        return prev! - 1;
      });
    }, 1000);
  };

  const handleCapturePhoto = async (
    videoRef: React.RefObject<HTMLVideoElement>,
    venueName: string,
    selectedVibe: VibeType,
    vibeConfig: Record<VibeType, VibeConfiguration>,
    currentFilter: string,
    stopCamera: () => void
  ): Promise<string | null> => {
    const imageDataUrl = await capturePhoto(videoRef, canvasRef, venueName, selectedVibe, vibeConfig, currentFilter);
    if (imageDataUrl) {
      setCapturedImage(imageDataUrl);
      stopCamera();
      return imageDataUrl;
    }
    return null;
  };

  const retakePhoto = (startCamera: () => void) => {
    setCapturedImage(null);
    startCamera();
  };

  return {
    canvasRef,
    countdown,
    capturedImage,
    showPosePrompt,
    startCountdown,
    handleCapturePhoto,
    retakePhoto
  };
};