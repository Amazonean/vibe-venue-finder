import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SelfieCameraProps {
  isOpen: boolean;
  onClose: () => void;
  venueName: string;
  selectedVibe: 'turnt' | 'decent' | 'chill';
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
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const { toast } = useToast();

  const vibeConfig = {
    turnt: {
      filter: 'hue-rotate(330deg) saturate(1.5) brightness(1.1)',
      badge: '🔥 Turnt',
      prompt: 'Hit your best \'Turnt\' pose! 🎉',
      hashtags: ['#TurntAt' + venueName.replace(/\s+/g, ''), '#VibeCheck', '#TurntUp', '#PartyMode']
    },
    decent: {
      filter: 'sepia(0.3) saturate(1.2) brightness(1.05) contrast(1.1)',
      badge: '🙂 Decent',
      prompt: 'Looking good! Strike a decent pose 📸',
      hashtags: ['#DecentNight', '#VibeCheck', '#GoodTimes', '#' + venueName.replace(/\s+/g, '')]
    },
    chill: {
      filter: 'hue-rotate(180deg) saturate(0.8) brightness(0.9) contrast(1.1)',
      badge: '😌 Chill',
      prompt: 'Chill mode: activated 😌',
      hashtags: ['#ChillVibes', '#Relaxed', '#VibeCheck', '#' + venueName.replace(/\s+/g, '')]
    }
  };

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
          setTimeout(capturePhoto, 100);
          return null;
        }
        return prev! - 1;
      });
    }, 1000);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Apply vibe filter
    ctx.filter = vibeConfig[selectedVibe].filter;
    
    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Reset filter for overlays
    ctx.filter = 'none';

    // Draw overlays
    drawOverlays(ctx, canvas.width, canvas.height);

    // Convert to image
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageDataUrl);
    stopCamera();
  };

  const drawOverlays = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Venue name at top
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.font = `bold ${Math.floor(width * 0.06)}px Arial`;
    ctx.textAlign = 'center';
    const venueY = height * 0.1;
    ctx.strokeText(venueName, width / 2, venueY);
    ctx.fillText(venueName, width / 2, venueY);

    // Vibe badge in bottom-left
    const badgeText = vibeConfig[selectedVibe].badge;
    const badgeX = width * 0.05;
    const badgeY = height * 0.9;
    const badgeWidth = width * 0.25;
    const badgeHeight = height * 0.06;

    // Badge background
    const badgeColors = {
      turnt: '#ff4444',
      decent: '#ffa500',
      chill: '#4488ff'
    };
    ctx.fillStyle = badgeColors[selectedVibe];
    ctx.fillRect(badgeX, badgeY - badgeHeight, badgeWidth, badgeHeight);

    // Badge text
    ctx.fillStyle = 'white';
    ctx.font = `bold ${Math.floor(width * 0.04)}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(badgeText, badgeX + badgeWidth / 2, badgeY - badgeHeight / 2 + height * 0.015);

    // App logo placeholder in bottom-right
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    const logoSize = width * 0.12;
    ctx.fillRect(width - logoSize - width * 0.05, height - logoSize - height * 0.05, logoSize, logoSize);
    
    ctx.fillStyle = 'white';
    ctx.font = `bold ${Math.floor(logoSize * 0.3)}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('VIBE', width - logoSize / 2 - width * 0.05, height - logoSize / 2 - height * 0.05 + logoSize * 0.1);
  };

  const saveToDevice = () => {
    if (!capturedImage) return;

    const link = document.createElement('a');
    link.download = `vibe-selfie-${venueName.replace(/\s+/g, '-')}-${selectedVibe}.jpg`;
    link.href = capturedImage;
    link.click();

    toast({
      title: "Photo Saved",
      description: "Your vibe selfie has been saved to your device!",
    });
  };

  const sharePhoto = async () => {
    if (!capturedImage) return;

    try {
      // Convert data URL to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], `vibe-selfie-${selectedVibe}.jpg`, { type: 'image/jpeg' });

      const shareData: ShareData = {
        files: [file],
        title: `Vibe Check at ${venueName}`,
      };

      if (includeHashtags) {
        shareData.text = `Vibe check at ${venueName}! ${vibeConfig[selectedVibe].hashtags.join(' ')}`;
      }

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({
          title: "Photo Shared",
          description: "Your vibe selfie has been shared!",
        });
      } else {
        // Fallback for browsers that don't support native sharing
        saveToDevice();
        toast({
          title: "Share Not Supported",
          description: "Photo saved to device instead. You can manually share it from your gallery.",
        });
      }
    } catch (error) {
      console.error('Share error:', error);
      saveToDevice();
      toast({
        title: "Share Failed",
        description: "Photo saved to device instead.",
        variant: "destructive"
      });
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
    <div className="fixed inset-0 z-50 bg-black">
      {/* Cancel button */}
      <Button
        onClick={onClose}
        variant="ghost"
        className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 px-4"
      >
        Cancel
      </Button>

      {capturedImage ? (
        // Photo preview mode
        <div className="flex flex-col h-full">
          <div className="flex-1 flex items-center justify-center">
            <img 
              src={capturedImage} 
              alt="Captured selfie" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
          
          <div className="p-6 bg-black/80">
            {/* Hashtag toggle */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <label className="flex items-center gap-2 text-white text-sm">
                <input
                  type="checkbox"
                  checked={includeHashtags}
                  onChange={(e) => setIncludeHashtags(e.target.checked)}
                  className="rounded"
                />
                Add vibe hashtags to your post?
              </label>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button
                onClick={saveToDevice}
                className="flex-1 gap-2"
                variant="outline"
              >
                <Download className="h-4 w-4" />
                Save to Device
              </Button>
              <Button
                onClick={sharePhoto}
                className="flex-1 gap-2"
              >
                <Share className="h-4 w-4" />
                Share
              </Button>
            </div>
            
            <Button
              onClick={retakePhoto}
              variant="ghost"
              className="w-full mt-3 text-white hover:bg-white/20"
            >
              Retake Photo
            </Button>
          </div>
        </div>
      ) : (
        // Camera mode
        <div className="relative h-full">
          {cameraError ? (
            <div className="flex items-center justify-center h-full text-white text-center p-6">
              <div>
                <p className="text-lg mb-4">{cameraError}</p>
                <Button onClick={startCamera} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ filter: vibeConfig[selectedVibe].filter }}
              />
              
              {/* Overlays */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Venue name */}
                <div className="absolute top-8 left-0 right-0 text-center">
                  <h1 className="text-white text-2xl font-bold drop-shadow-lg">
                    {venueName}
                  </h1>
                </div>

                {/* Vibe badge */}
                <div className="absolute bottom-8 left-6">
                  <div className={`px-4 py-2 rounded-full font-bold text-white ${
                    selectedVibe === 'turnt' ? 'bg-red-500' :
                    selectedVibe === 'decent' ? 'bg-orange-500' :
                    'bg-blue-500'
                  }`}>
                    {vibeConfig[selectedVibe].badge}
                  </div>
                </div>

                {/* App logo */}
                <div className="absolute bottom-8 right-6">
                  <div className="w-16 h-16 bg-black/70 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">VIBE</span>
                  </div>
                </div>

                {/* Countdown */}
                {countdown && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-8xl font-bold drop-shadow-lg animate-pulse">
                      {countdown}
                    </div>
                  </div>
                )}

                {/* Pose prompt */}
                {showPosePrompt && (
                  <div className="absolute top-1/3 left-0 right-0 text-center">
                    <p className="text-white text-xl font-semibold drop-shadow-lg bg-black/50 mx-6 py-3 rounded-lg">
                      {vibeConfig[selectedVibe].prompt}
                    </p>
                  </div>
                )}
              </div>

              {/* Capture button */}
              {!countdown && (
                <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                  <Button
                    onClick={startCountdown}
                    size="lg"
                    className="w-20 h-20 rounded-full bg-white text-black hover:bg-gray-200"
                  >
                    📸
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default SelfieCamera;