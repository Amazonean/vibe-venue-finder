import React from 'react';
import { Button } from '@/components/ui/button';

interface CameraErrorProps {
  cameraError: string | null;
  onStartCamera: () => void;
}

const CameraError: React.FC<CameraErrorProps> = ({ cameraError, onStartCamera }) => {
  if (!cameraError) return null;

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
};

export default CameraError;