import { useState, useEffect, useCallback } from 'react';
import { MediaConfiguration, createMediaConfiguration } from '../config/MediaConfig';

export const useMediaConfiguration = (
  containerRef: React.RefObject<HTMLElement>
) => {
  const [config, setConfig] = useState<MediaConfiguration | null>(null);

  const updateConfiguration = useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const newConfig = createMediaConfiguration(rect.width, rect.height);
    setConfig(newConfig);
  }, [containerRef]);

  useEffect(() => {
    updateConfiguration();

    const resizeObserver = new ResizeObserver(updateConfiguration);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateConfiguration, containerRef]);

  return { config, updateConfiguration };
};