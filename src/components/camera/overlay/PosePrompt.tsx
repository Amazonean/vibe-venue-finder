import React from 'react';
import { VibeType, VibeConfiguration } from '../VibeConfig';

interface PosePromptProps {
  showPosePrompt: boolean;
  selectedVibe: VibeType;
  vibeConfig: Record<VibeType, VibeConfiguration>;
}

const PosePrompt: React.FC<PosePromptProps> = ({
  showPosePrompt,
  selectedVibe,
  vibeConfig
}) => {
  if (!showPosePrompt) return null;

  return (
    <div className="absolute top-1/3 left-0 right-0 text-center px-4">
      <p className="text-white text-xl font-semibold drop-shadow-lg bg-black/50 mx-6 py-3 rounded-lg">
        {vibeConfig[selectedVibe].prompt}
      </p>
    </div>
  );
};

export default PosePrompt;