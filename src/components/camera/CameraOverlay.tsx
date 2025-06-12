import React from 'react';
import { Button } from '@/components/ui/button';
import { VibeType, VibeConfiguration } from './VibeConfig';

interface CameraOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  venueName: string;
  selectedVibe: VibeType;
  vibeConfig: Record<VibeType, VibeConfiguration>;
  countdown: number | null;
  showPosePrompt: boolean;
  cameraError: string | null;
  onStartCountdown: () => void;
  onStartCamera: () => void;
}

const CameraOverlay: React.FC<CameraOverlayProps> = ({
  videoRef,
  venueName,
  selectedVibe,
  vibeConfig,
  countdown,
  showPosePrompt,
  cameraError,
  onStartCountdown,
  onStartCamera
}) => {
  if (cameraError) {
    return (
      <div className="flex items-center justify-center h-full text-white text-center p-6">
        <div>
          <p className="text-lg mb-4">{cameraError}</p>
          <Button onClick={onStartCamera} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
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
        <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-auto">
          <button
            onClick={onStartCountdown}
            className="w-24 h-24 rounded-full flex items-center justify-center text-4xl transition-all duration-200 transform hover:scale-110 active:scale-95"
            style={{
              background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 2px 8px rgba(255, 255, 255, 0.5), inset 0 -2px 8px rgba(0, 0, 0, 0.1)',
              border: '4px solid rgba(255, 255, 255, 0.8)',
            }}
          >
            <div 
              className="w-4 h-4 rounded-full"
              style={{
                background: selectedVibe === 'turnt' ? '#FF3B1F' :
                           selectedVibe === 'decent' ? '#B47AFF' : '#4BD5FF',
                boxShadow: `0 0 12px ${selectedVibe === 'turnt' ? 'rgba(255, 59, 31, 0.8)' :
                           selectedVibe === 'decent' ? 'rgba(180, 122, 255, 0.8)' : 'rgba(75, 213, 255, 0.8)'}`
              }}
            />
          </button>
        </div>
      )}
    </>
  );
};

export default CameraOverlay;