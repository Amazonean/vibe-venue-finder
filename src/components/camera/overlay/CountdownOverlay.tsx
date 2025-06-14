import React from 'react';

interface CountdownOverlayProps {
  countdown: number | null;
}

const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ countdown }) => {
  if (!countdown) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-white text-8xl font-bold drop-shadow-lg animate-pulse">
        {countdown}
      </div>
    </div>
  );
};

export default CountdownOverlay;