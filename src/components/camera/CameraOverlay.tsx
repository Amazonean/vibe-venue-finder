import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { VibeType, VibeConfiguration } from './VibeConfig';

const filters = [
  { name: 'Default', style: 'none' },
  { name: 'Clarendon', style: 'brightness(1.1) contrast(1.2) saturate(1.35)' },
  { name: 'Juno', style: 'sepia(0.3) saturate(1.4) hue-rotate(15deg) brightness(1.1)' },
  { name: 'Gingham', style: 'sepia(0.4) saturate(0.8) brightness(1.1) contrast(0.9)' }
];

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
  currentFilter?: string;
  onFilterChange?: (filter: string) => void;
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
  onStartCamera,
  currentFilter = 'Default',
  onFilterChange
}) => {
  const [currentFilterIndex, setCurrentFilterIndex] = useState(0);
  const [showFilterName, setShowFilterName] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const filterIndex = filters.findIndex(f => f.name === currentFilter);
    setCurrentFilterIndex(filterIndex >= 0 ? filterIndex : 0);
  }, [currentFilter]);

  const handleInteractionStart = (clientX: number) => {
    setTouchStartX(clientX);
    setIsMouseDown(true);
  };

  const handleInteractionMove = (clientX: number) => {
    if (!onFilterChange || (!isMouseDown && !touchStartX)) return;
    
    const diff = touchStartX - clientX;
    
    if (Math.abs(diff) > 50) { // Minimum swipe distance
      let newIndex = currentFilterIndex;
      
      if (diff > 0 && currentFilterIndex < filters.length - 1) {
        newIndex = currentFilterIndex + 1;
      } else if (diff < 0 && currentFilterIndex > 0) {
        newIndex = currentFilterIndex - 1;
      }
      
      if (newIndex !== currentFilterIndex) {
        setCurrentFilterIndex(newIndex);
        onFilterChange(filters[newIndex].style);
        setShowFilterName(true);
        setTimeout(() => setShowFilterName(false), 1500);
        setTouchStartX(clientX); // Reset for continuous swiping
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleInteractionStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleInteractionMove(e.touches[0].clientX);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleInteractionStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMouseDown) {
      handleInteractionMove(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const getVibeBadgeImage = (vibe: VibeType) => {
    switch (vibe) {
      case 'turnt':
        return '/lovable-uploads/20a93d55-cfbc-417d-b442-a073caa5158f.png';
      case 'chill':
        return '/lovable-uploads/4b5069a8-223b-47a6-b22b-5439eade3e91.png';
      case 'quiet':
        return '/lovable-uploads/750b5511-5654-47b1-93a5-1bb9063ad60c.png';
      default:
        return '/lovable-uploads/20a93d55-cfbc-417d-b442-a073caa5158f.png';
    }
  };

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
    <div 
      className="relative h-full cursor-grab active:cursor-grabbing"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        style={{ filter: filters[currentFilterIndex].style }}
      />
      
      {/* Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Venue name - Fixed at top center */}
        <div className="absolute top-8 left-0 right-0 text-center px-4">
          <div className="inline-block bg-black/40 px-4 py-2 rounded-lg">
            <h1 
              className="text-2xl sm:text-3xl font-bold uppercase drop-shadow-lg"
              style={{ 
                color: '#C26AF5',
                textShadow: '0 0 10px rgba(194, 106, 245, 0.5), 0 2px 4px rgba(0, 0, 0, 0.8)',
                lineHeight: '1.1'
              }}
            >
              {venueName}
            </h1>
          </div>
        </div>

        {/* Custom Vibe Badge - Bottom left */}
        <div className="absolute bottom-20 left-4">
          <img 
            src={getVibeBadgeImage(selectedVibe)}
            alt={`${selectedVibe} vibe`}
            className="w-20 h-auto drop-shadow-lg"
            style={{
              filter: 'drop-shadow(2px 2px 8px rgba(0, 0, 0, 0.8))'
            }}
          />
        </div>

        {/* TurntUp logo - Bottom right */}
        <div className="absolute bottom-8 right-4">
          <img 
            src="/lovable-uploads/4798e35a-824c-4ddc-9916-74b59aac299d.png"
            alt="TurntUp Logo"
            className="w-16 h-auto drop-shadow-lg"
            style={{
              filter: 'drop-shadow(2px 2px 8px rgba(0, 0, 0, 0.8))'
            }}
          />
        </div>

        {/* Filter Name Display */}
        {showFilterName && (
          <div className="absolute top-1/2 left-0 right-0 text-center">
            <div className="inline-block bg-black/60 px-6 py-3 rounded-full animate-fade-in">
              <p className="text-white text-lg font-semibold">
                {filters[currentFilterIndex].name}
              </p>
            </div>
          </div>
        )}

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
          <div className="absolute top-1/3 left-0 right-0 text-center px-4">
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
                           selectedVibe === 'chill' ? '#B47AFF' : '#4BD5FF',
                boxShadow: `0 0 12px ${selectedVibe === 'turnt' ? 'rgba(255, 59, 31, 0.8)' :
                           selectedVibe === 'chill' ? 'rgba(180, 122, 255, 0.8)' : 'rgba(75, 213, 255, 0.8)'}`
              }}
            />
          </button>
        </div>
      )}

      {/* Swipe hint */}
      {!countdown && !showPosePrompt && (
        <div className="absolute bottom-32 left-0 right-0 text-center pointer-events-none">
          <p className="text-white/60 text-sm">Swipe or drag left/right to change filters</p>
        </div>
      )}
    </div>
  );
};

export default CameraOverlay;