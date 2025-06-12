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
      filter: 'sepia(0.3) saturate(1.8) hue-rotate(350deg) brightness(1.1)',
      overlayColor: 'rgba(255, 59, 31, 0.25)',
      badge: 'Turnt',
      prompt: 'Get Turnt! 🎉',
      hashtags: ['#TurntUpAt' + venueName.replace(/\s+/g, ''), '#VibeCheck', '#TurntUp', '#PartyMode']
    },
    decent: {
      filter: 'sepia(0.4) saturate(1.3) hue-rotate(280deg) brightness(1.05)',
      overlayColor: 'rgba(180, 122, 255, 0.25)',
      badge: 'Decent',
      prompt: 'Keep it Decent 😎',
      hashtags: ['#DecentNight', '#VibeCheck', '#GoodTimes', '#TurntUpAt' + venueName.replace(/\s+/g, '')]
    },
    chill: {
      filter: 'sepia(0.2) saturate(1.1) hue-rotate(180deg) brightness(0.95)',
      overlayColor: 'rgba(75, 213, 255, 0.25)',
      badge: 'Chill',
      prompt: 'Just Chill 😌',
      hashtags: ['#ChillScene', '#VibeCheck', '#ChillVibes', '#TurntUpAt' + venueName.replace(/\s+/g, '')]
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

  const capturePhoto = async () => {
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

    // Draw overlays (await for logo loading)
    await drawOverlays(ctx, canvas.width, canvas.height);

    // Convert to image
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageDataUrl);
    stopCamera();
  };

  const drawOverlays = async (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Add color overlay filter
    ctx.fillStyle = vibeConfig[selectedVibe].overlayColor;
    ctx.fillRect(0, 0, width, height);

    // Venue name background
    const venueY = height * 0.1;
    const venueBackgroundHeight = height * 0.08;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.roundRect(width * 0.1, venueY - venueBackgroundHeight/2, width * 0.8, venueBackgroundHeight, 15);
    ctx.fill();

    // Venue name text with purple glow effect
    ctx.fillStyle = '#C26AF5';
    ctx.strokeStyle = 'rgba(194, 106, 245, 0.5)';
    ctx.lineWidth = 8;
    ctx.font = `bold ${Math.floor(width * 0.06)}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    
    // Create glow effect
    ctx.shadowColor = 'rgba(194, 106, 245, 0.8)';
    ctx.shadowBlur = 20;
    ctx.strokeText(venueName, width / 2, venueY);
    ctx.fillText(venueName, width / 2, venueY);
    ctx.shadowBlur = 0;

    // Vibe badge in bottom-left
    const badgeText = vibeConfig[selectedVibe].badge;
    const badgeX = width * 0.05;
    const badgeY = height * 0.85;
    const badgeWidth = width * 0.3;
    const badgeHeight = height * 0.08;

    // Badge colors matching live view
    const badgeColors = {
      turnt: '#FF3B1F',
      decent: '#B47AFF',
      chill: '#4BD5FF'
    };

    // Badge background with rounded corners and shadow
    ctx.fillStyle = badgeColors[selectedVibe];
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;
    ctx.roundRect(badgeX, badgeY - badgeHeight, badgeWidth, badgeHeight, badgeHeight / 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Badge glow effect
    ctx.shadowColor = badgeColors[selectedVibe];
    ctx.shadowBlur = 15;
    ctx.roundRect(badgeX, badgeY - badgeHeight, badgeWidth, badgeHeight, badgeHeight / 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Badge text
    ctx.fillStyle = 'white';
    ctx.font = `bold ${Math.floor(width * 0.045)}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(badgeText, badgeX + badgeWidth / 2, badgeY - badgeHeight / 2 + height * 0.015);

    // TurntUp logo in bottom-right
    try {
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      
      return new Promise<void>((resolve) => {
        logoImg.onload = () => {
          const logoSize = width * 0.15;
          const logoX = width - logoSize - width * 0.05;
          const logoY = height - logoSize - height * 0.05;
          
          // Add drop shadow for logo
          ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize * (logoImg.height / logoImg.width));
          
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          
          resolve();
        };
        
        logoImg.onerror = () => {
          // Fallback to text if image fails to load
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          const logoSize = width * 0.12;
          ctx.fillRect(width - logoSize - width * 0.05, height - logoSize - height * 0.05, logoSize, logoSize);
          
          ctx.fillStyle = 'white';
          ctx.font = `bold ${Math.floor(logoSize * 0.3)}px Arial`;
          ctx.textAlign = 'center';
          ctx.fillText('TURNT', width - logoSize / 2 - width * 0.05, height - logoSize / 2 - height * 0.05 + logoSize * 0.1);
          
          resolve();
        };
        
        logoImg.src = '/lovable-uploads/4798e35a-824c-4ddc-9916-74b59aac299d.png';
      });
    } catch (error) {
      // Fallback to text
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      const logoSize = width * 0.12;
      ctx.fillRect(width - logoSize - width * 0.05, height - logoSize - height * 0.05, logoSize, logoSize);
      
      ctx.fillStyle = 'white';
      ctx.font = `bold ${Math.floor(logoSize * 0.3)}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText('TURNT', width - logoSize / 2 - width * 0.05, height - logoSize / 2 - height * 0.05 + logoSize * 0.1);
    }
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
              
              {/* Color overlay filter */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{ backgroundColor: vibeConfig[selectedVibe].overlayColor }}
              />
              
              {/* Overlays */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Venue name */}
                <div className="absolute top-8 left-0 right-0 text-center">
                  <div className="bg-black/40 mx-4 rounded-lg py-2">
                    <h1 
                      className="text-3xl font-bold drop-shadow-lg"
                      style={{ 
                        color: '#C26AF5',
                        textShadow: '0 0 10px rgba(194, 106, 245, 0.5), 0 2px 4px rgba(0, 0, 0, 0.8)'
                      }}
                    >
                      {venueName}
                    </h1>
                  </div>
                </div>

                {/* Vibe badge */}
                <div className="absolute bottom-20 left-6">
                  <div 
                    className="px-6 py-3 rounded-full font-bold text-white text-lg transform shadow-lg"
                    style={{
                      backgroundColor: selectedVibe === 'turnt' ? '#FF3B1F' :
                                     selectedVibe === 'decent' ? '#B47AFF' : '#4BD5FF',
                      boxShadow: selectedVibe === 'turnt' ? '0 0 15px rgba(255, 59, 31, 0.6), 0 4px 8px rgba(0, 0, 0, 0.8)' :
                                selectedVibe === 'decent' ? '0 0 15px rgba(180, 122, 255, 0.6), 0 4px 8px rgba(0, 0, 0, 0.8)' :
                                '0 0 15px rgba(75, 213, 255, 0.6), 0 4px 8px rgba(0, 0, 0, 0.8)',
                      filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5))'
                    }}
                  >
                    {vibeConfig[selectedVibe].badge}
                  </div>
                </div>

                {/* TurntUp logo */}
                <div className="absolute bottom-8 right-6">
                  <img 
                    src="/lovable-uploads/4798e35a-824c-4ddc-9916-74b59aac299d.png"
                    alt="TurntUp Logo"
                    className="w-20 h-auto drop-shadow-lg"
                    style={{
                      filter: 'drop-shadow(2px 2px 8px rgba(0, 0, 0, 0.8))'
                    }}
                  />
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