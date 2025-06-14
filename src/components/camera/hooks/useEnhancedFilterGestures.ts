import { useState, useCallback, useRef } from 'react';
import { FilterDefinition, FILTER_DEFINITIONS, getNextFilter, getPreviousFilter } from '../config/FilterConfig';

export const useEnhancedFilterGestures = (
  initialFilterId: string = 'none',
  onFilterChange?: (filter: FilterDefinition) => void
) => {
  const [currentFilter, setCurrentFilter] = useState<FilterDefinition>(() => 
    FILTER_DEFINITIONS.find(f => f.id === initialFilterId) || FILTER_DEFINITIONS[0]
  );
  const [showFilterName, setShowFilterName] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  
  const interactionStartRef = useRef<{ x: number; time: number } | null>(null);
  const filterNameTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showFilterNameTemporarily = useCallback(() => {
    setShowFilterName(true);
    
    if (filterNameTimeoutRef.current) {
      clearTimeout(filterNameTimeoutRef.current);
    }
    
    filterNameTimeoutRef.current = setTimeout(() => {
      setShowFilterName(false);
    }, 1500);
  }, []);

  const changeFilter = useCallback((newFilter: FilterDefinition) => {
    setCurrentFilter(newFilter);
    onFilterChange?.(newFilter);
    showFilterNameTemporarily();
  }, [onFilterChange, showFilterNameTemporarily]);

  const handleInteractionStart = useCallback((clientX: number) => {
    setIsInteracting(true);
    interactionStartRef.current = {
      x: clientX,
      time: Date.now()
    };
  }, []);

  const handleInteractionMove = useCallback((clientX: number) => {
    if (!isInteracting || !interactionStartRef.current) return;

    const deltaX = clientX - interactionStartRef.current.x;
    const minSwipeDistance = 80;
    
    if (Math.abs(deltaX) >= minSwipeDistance) {
      if (deltaX > 0) {
        // Swipe right - previous filter
        const prevFilter = getPreviousFilter(currentFilter.id);
        changeFilter(prevFilter);
      } else {
        // Swipe left - next filter
        const nextFilter = getNextFilter(currentFilter.id);
        changeFilter(nextFilter);
      }
      
      // Reset interaction
      interactionStartRef.current = {
        x: clientX,
        time: Date.now()
      };
    }
  }, [isInteracting, currentFilter.id, changeFilter]);

  const handleInteractionEnd = useCallback(() => {
    setIsInteracting(false);
    interactionStartRef.current = null;
  }, []);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    handleInteractionStart(e.touches[0].clientX);
  }, [handleInteractionStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    handleInteractionMove(e.touches[0].clientX);
  }, [handleInteractionMove]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    handleInteractionEnd();
  }, [handleInteractionEnd]);

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleInteractionStart(e.clientX);
  }, [handleInteractionStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isInteracting) {
      e.preventDefault();
      handleInteractionMove(e.clientX);
    }
  }, [isInteracting, handleInteractionMove]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleInteractionEnd();
  }, [handleInteractionEnd]);

  return {
    currentFilter,
    showFilterName,
    isInteracting,
    setCurrentFilter: changeFilter,
    gestureHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleInteractionEnd
    }
  };
};