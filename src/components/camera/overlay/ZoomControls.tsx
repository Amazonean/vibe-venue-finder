import React, { useEffect, useState } from 'react';
import { Slider } from '@/components/ui/slider';

interface ZoomControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  zoomScale?: number;
  onZoomChange?: (val: number) => void;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ videoRef, zoomScale = 1, onZoomChange }) => {
  const [supported, setSupported] = useState(false);
  const [hasHardwareZoom, setHasHardwareZoom] = useState(false);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(3);
  const [step, setStep] = useState(0.1);
  const [zoom, setZoom] = useState(zoomScale);

  useEffect(() => {
    const init = async () => {
      try {
        const stream = (videoRef.current?.srcObject as MediaStream) || null;
        const track = stream?.getVideoTracks?.()[0];
        const caps: any = track?.getCapabilities?.();
        if (caps && caps.zoom) {
          setSupported(true);
          setHasHardwareZoom(true);
          setMin(caps.zoom.min ?? 1);
          setMax(caps.zoom.max ?? 1);
          setStep(caps.zoom.step ?? 0.1);
          const settings: any = track?.getSettings?.();
          if (settings?.zoom) setZoom(settings.zoom);
        } else {
          // Fallback to digital zoom via CSS/canvas
          setSupported(true);
          setHasHardwareZoom(false);
          setMin(1);
          setMax(3);
          setStep(0.1);
          setZoom(zoomScale);
        }
      } catch (e) {
        setSupported(false);
      }
    };
    init();
  }, [videoRef]);

  const clamp = (val: number) => Math.min(max, Math.max(min, val));

  const applyZoom = async (val: number) => {
    const clamped = clamp(val);
    try {
      const stream = (videoRef.current?.srcObject as MediaStream) || null;
      const track = stream?.getVideoTracks?.()[0];
      if (hasHardwareZoom && track) {
        await (track as any).applyConstraints?.({ advanced: [{ zoom: clamped }] });
        setZoom(clamped);
      } else {
        // Digital zoom fallback
        setZoom(clamped);
        onZoomChange?.(clamped);
      }
    } catch (e) {
      // ignore if not supported
    }
  };

  // Always render controls if supported or using fallback
  if (!supported) return null;

  return (
    <div
      data-no-gesture="true"
      className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 p-2 rounded-xl bg-background/70 backdrop-blur border border-border shadow-sm pointer-events-auto z-30"
    >
      <div className="h-40 flex items-center">
        <Slider
          orientation="vertical"
          min={min}
          max={max}
          step={step}
          value={[zoom]}
          onValueChange={(val) => applyZoom(val[0] ?? zoom)}
          className="h-36 w-6"
        />
      </div>
      <div className="text-xs text-muted-foreground text-center select-none">
        {zoom.toFixed(1)}x
      </div>
    </div>
  );
};

export default ZoomControls;
