import React from 'react';
import { Filter } from '../types';

interface CameraVideoProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  currentFilterIndex: number;
  filters: Filter[];
}

const CameraVideo: React.FC<CameraVideoProps> = ({
  videoRef,
  currentFilterIndex,
  filters
}) => {
  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="w-full h-full object-cover bg-black"
      style={{ filter: filters[currentFilterIndex].style }}
    />
  );
};

export default CameraVideo;