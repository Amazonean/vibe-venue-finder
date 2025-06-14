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
    <div className="absolute top-8 right-4">
      <div className="flex items-center gap-2 bg-red-600 px-3 py-2 rounded-full">
        <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
        <span className="text-white text-sm font-semibold">
          REC {recordingTime}s
        </span>
      </div>
    </div>
  );
};

export default RecordingIndicator;