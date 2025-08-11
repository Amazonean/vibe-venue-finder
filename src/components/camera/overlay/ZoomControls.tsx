import React, { useEffect, useState } from 'react';

interface ZoomControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ videoRef }) => {
  const [supported, setSupported] = useState(false);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(1);
  const [step, setStep] = useState(0.1);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const init = async () => {
      try {
        const stream = (videoRef.current?.srcObject as MediaStream) || null;
        const track = stream?.getVideoTracks?.()[0];
        // Use any-typed capabilities to avoid TS issues on browsers without zoom typing
        const caps: any = track?.getCapabilities?.();
        if (caps && caps.zoom) {
          setSupported(true);
          setMin(caps.zoom.min ?? 1);
          setMax(caps.zoom.max ?? 1);
          setStep(caps.zoom.step ?? 0.1);
          const settings: any = track?.getSettings?.();
          if (settings?.zoom) setZoom(settings.zoom);
        }
      } catch (e) {
        setSupported(false);
      }
    };
    init();
  }, [videoRef]);

  const clamp = (val: number) => Math.min(max, Math.max(min, val));

  const applyZoom = async (val: number) => {
    try {
      const stream = (videoRef.current?.srcObject as MediaStream) || null;
      const track = stream?.getVideoTracks?.()[0];
      if (!track) return;
      await (track as any).applyConstraints?.({ advanced: [{ zoom: val }] });
      setZoom(val);
    } catch (e) {
      // ignore if not supported
    }
  };

  if (!supported) return null;

  return (
    <div
      data-no-gesture="true"
      className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 p-2 rounded-xl bg-background/70 backdrop-blur border border-border shadow-sm pointer-events-auto z-30"
    >
      <button
        className="w-8 h-8 rounded-md bg-muted text-foreground flex items-center justify-center border border-border"
        onClick={() => applyZoom(clamp(zoom + step))}
        aria-label="Zoom in"
      >
        +
      </button>
      <div className="text-xs text-muted-foreground text-center select-none">
        {zoom.toFixed(1)}x
      </div>
      <button
        className="w-8 h-8 rounded-md bg-muted text-foreground flex items-center justify-center border border-border"
        onClick={() => applyZoom(clamp(zoom - step))}
        aria-label="Zoom out"
      >
        −
      </button>
    </div>
  );
};

export default ZoomControls;
