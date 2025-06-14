import React from 'react';

interface CameraVideoProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  filter: string;
}

const CameraVideo: React.FC<CameraVideoProps> = ({
  videoRef,
  filter
}) => {
  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="w-full h-full object-cover bg-black"
      style={{ filter }}
    />
  );
};

export default CameraVideo;