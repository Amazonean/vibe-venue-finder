import React from 'react';

interface RecordingIndicatorProps {
  isRecording: boolean;
  recordingTime: number;
}

const RecordingIndicator: React.FC<RecordingIndicatorProps> = ({
  isRecording,
  recordingTime
}) => {
  if (!isRecording) return null;

  return (
    <div className="absolute right-4" style={{ top: 'calc(env(safe-area-inset-top) + var(--top-nav-height, 64px) + 8px)' }}>
      <div className="flex items-center gap-2 bg-red-600 px-3 py-2 rounded-full shadow-lg/50">
        <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
        <span className="text-white text-sm font-semibold">
          REC {recordingTime}s
        </span>
      </div>
    </div>
  );
};

export default RecordingIndicator;