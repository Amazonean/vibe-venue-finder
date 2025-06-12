import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getVibeConfig, VibeType } from './camera/VibeConfig';
import { capturePhoto } from './camera/PhotoCapture';
import CameraOverlay from './camera/CameraOverlay';
import PhotoPreview from './camera/PhotoPreview';

interface SelfieCameraProps {
  isOpen: boolean;
  onClose: () => void;
  venueName: string;
  selectedVibe: VibeType;
}

const SelfieCamera: React.FC<SelfieCameraProps> = ({
  isOpen,
  onClose,
  venueName,
  selectedVibe
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showPosePrompt, setShowPosePrompt] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const { toast } = useToast();

  const vibeConfig = getVibeConfig(venueName);

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1080 },
          height: { ideal: 1920 }
        },
        audio: false
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setCameraError('Camera access denied. Please enable camera permissions and try again.');
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const startCountdown = () => {
    setShowPosePrompt(true);
    setTimeout(() => setShowPosePrompt(false), 2000);
    
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(timer);
          setTimeout(handleCapturePhoto, 100);
          return null;
        }
        return prev! - 1;
      });
    }, 1000);
  };

  const handleCapturePhoto = async () => {
    const imageDataUrl = await capturePhoto(videoRef, canvasRef, venueName, selectedVibe, vibeConfig);
    if (imageDataUrl) {
      setCapturedImage(imageDataUrl);
      stopCamera();
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [isOpen, capturedImage, startCamera, stopCamera]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      {/* Cancel button */}
      <Button
        onClick={onClose}
        variant="ghost"
        className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 px-4"
      >
        Cancel
      </Button>

      {capturedImage ? (
        <PhotoPreview
          capturedImage={capturedImage}
          venueName={venueName}
          selectedVibe={selectedVibe}
          vibeConfig={vibeConfig}
          onRetakePhoto={retakePhoto}
        />
      ) : (
        <div className="relative h-full">
          <CameraOverlay
            videoRef={videoRef}
            venueName={venueName}
            selectedVibe={selectedVibe}
            vibeConfig={vibeConfig}
            countdown={countdown}
            showPosePrompt={showPosePrompt}
            cameraError={cameraError}
            onStartCountdown={startCountdown}
            onStartCamera={startCamera}
          />
        </div>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default SelfieCamera;