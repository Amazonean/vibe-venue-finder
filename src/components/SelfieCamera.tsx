import React, { useEffect, useState } from 'react';
import { VibeType, getVibeConfig } from './camera/VibeConfig';
import CameraInterface from './camera/CameraInterface';
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
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const vibeConfig = getVibeConfig(venueName);

  const handlePhotoCapture = (imageDataUrl: string) => {
    setCapturedImage(imageDataUrl);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  // Cleanup effect when closing or unmounting
  useEffect(() => {
    if (!isOpen) {
      setCapturedImage(null);
      // Re-enable body scrolling
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    
    return () => {
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

      {capturedImage ? (
        <PhotoPreview
          capturedImage={capturedImage}
          venueName={venueName}
          selectedVibe={selectedVibe}
          vibeConfig={vibeConfig}
          onRetakePhoto={retakePhoto}
        />
      ) : (
        <CameraInterface
          venueName={venueName}
          selectedVibe={selectedVibe}
          onPhotoCapture={handlePhotoCapture}
          onClose={onClose}
        />
      )}
    </div>
  );
};

export default SelfieCamera;