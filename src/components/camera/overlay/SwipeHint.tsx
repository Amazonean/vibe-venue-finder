import React from 'react';

interface SwipeHintProps {
  countdown: number | null;
  showPosePrompt: boolean;
  isRecording: boolean;
}

const SwipeHint: React.FC<SwipeHintProps> = ({
  countdown,
  showPosePrompt,
  isRecording
}) => {
  if (countdown || showPosePrompt || isRecording) return null;

  return (
    <div className="absolute left-0 right-0 text-center pointer-events-none" style={{ bottom: 'calc(env(safe-area-inset-bottom) + var(--bottom-nav-height, 72px) + 120px)' }}>
      <p className="text-white/60 text-sm">Swipe or drag left/right to change filters</p>
      <p className="text-white/50 text-xs mt-1">Tap for photo • Hold for 10s video</p>
    </div>
  );
};

export default SwipeHint;