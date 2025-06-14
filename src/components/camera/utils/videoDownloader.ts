export const downloadVideo = (
  recordedChunks: Blob[],
  venueName: string,
  selectedVibe: string
): void => {
  const blob = new Blob(recordedChunks, { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  
  // Create download link for the video
  const link = document.createElement('a');
  link.href = url;
  link.download = `vibe-video-${venueName.replace(/\s+/g, '-')}-${selectedVibe}.webm`;
  link.click();
  
  URL.revokeObjectURL(url);
};