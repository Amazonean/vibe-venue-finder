import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share } from 'lucide-react';
import { VibeType, VibeConfiguration } from '../VibeConfig';

interface VideoPreviewControlsProps {
  includeHashtags: boolean;
  setIncludeHashtags: (value: boolean) => void;
  selectedVibe: VibeType;
  vibeConfig: Record<VibeType, VibeConfiguration>;
  onSave: () => void;
  onShare: () => void;
  onRetake: () => void;
}

const VideoPreviewControls: React.FC<VideoPreviewControlsProps> = ({
  includeHashtags,
  setIncludeHashtags,
  selectedVibe,
  vibeConfig,
  onSave,
  onShare,
  onRetake
}) => {
  return (
    <div className="flex-shrink-0 p-3 bg-black/90 space-y-2 border-t border-gray-800" style={{ paddingBottom: 'env(safe-area-inset-bottom, 12px)' }}>
      {/* Hashtag toggle */}
      <div className="flex items-center justify-center">
        <label className="flex items-center gap-2 text-white text-xs">
          <input
            type="checkbox"
            checked={includeHashtags}
            onChange={(e) => setIncludeHashtags(e.target.checked)}
            className="w-3 h-3 text-primary bg-gray-800 border-gray-600 rounded focus:ring-primary focus:ring-1"
          />
          Add vibe hashtags?
        </label>
      </div>

      {/* Preview hashtags - collapsible */}
      {includeHashtags && (
        <div className="p-2 bg-gray-900/50 rounded text-center">
          <p className="text-xs text-blue-300 leading-tight">
            {vibeConfig[selectedVibe].hashtags.join(' ')}
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          onClick={onSave}
          className="flex-1 gap-1 h-8 text-xs"
          variant="outline"
          size="sm"
        >
          <Download className="h-3 w-3" />
          Save
        </Button>
        <Button
          onClick={onShare}
          className="flex-1 gap-1 h-8 text-xs"
          size="sm"
        >
          <Share className="h-3 w-3" />
          Share
        </Button>
      </div>
      
      <Button
        onClick={onRetake}
        variant="ghost"
        className="w-full text-white hover:bg-white/20 h-8 text-xs"
        size="sm"
      >
        Retake Video
      </Button>
    </div>
  );
};

export default VideoPreviewControls;