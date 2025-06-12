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
  const streamRef = useRef<MediaStream | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showPosePrompt, setShowPosePrompt] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const { toast } = useToast();

  const vibeConfig = getVibeConfig(venueName);

  const startCamera = useCallback(async () => {
    try {
      console.log('Starting camera...');
      setCameraError(null);
      
      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        },
        audio: false
      });
      
      console.log('Camera stream obtained:', mediaStream);
      streamRef.current = mediaStream;
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Ensure video starts playing
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(err => {
            console.error('Error playing video:', err);
          });
        };
      }
    } catch (error) {
      console.error('Camera access error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown camera error';
      setCameraError(`Camera access failed: ${errorMessage}. Please check permissions and try again.`);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setStream(null);
    }
  }, []);

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
    if (isOpen && !capturedImage && !streamRef.current) {
      // Add a small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        startCamera();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, capturedImage, startCamera]);

  // Cleanup effect when closing or unmounting
  useEffect(() => {
    if (!isOpen && streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setStream(null);
      // Re-enable body scrolling
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      // Re-enable body scrolling when component unmounts
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black overflow-hidden" style={{ touchAction: 'none' }}>
      {/* Prevent scrolling and hide scrollbars */}
      <style>{`
        body { overflow: hidden !important; }
        html { overflow: hidden !important; }
        * { -webkit-overflow-scrolling: auto !important; }
      `}</style>
      
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