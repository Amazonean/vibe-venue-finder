import React from 'react';

interface CameraVideoProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  filter: string;
  zoomScale?: number;
}

const CameraVideo: React.FC<CameraVideoProps> = ({
  videoRef,
  filter,
  zoomScale = 1
}) => {
  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="w-full h-full object-cover bg-black"
      style={{ filter, transform: `scale(${zoomScale})`, transformOrigin: 'center center' }}
    />
  );
};

export default CameraVideo;