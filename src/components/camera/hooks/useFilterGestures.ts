import { useState, useEffect } from 'react';
import { Filter, filters } from '../types';

export const useFilterGestures = (
  currentFilter: string = 'Default',
  onFilterChange?: (filter: string) => void
) => {
  const [currentFilterIndex, setCurrentFilterIndex] = useState(0);
  const [showFilterName, setShowFilterName] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const filterIndex = filters.findIndex(f => f.name === currentFilter);
    setCurrentFilterIndex(filterIndex >= 0 ? filterIndex : 0);
  }, [currentFilter]);

  const handleInteractionStart = (clientX: number) => {
    setTouchStartX(clientX);
    setIsMouseDown(true);
  };

  const handleInteractionMove = (clientX: number) => {
    if (!onFilterChange || (!isMouseDown && !touchStartX)) return;
    
    const diff = touchStartX - clientX;
    
    if (Math.abs(diff) > 50) { // Minimum swipe distance
      let newIndex = currentFilterIndex;
      
      if (diff > 0 && currentFilterIndex < filters.length - 1) {
        newIndex = currentFilterIndex + 1;
      } else if (diff < 0 && currentFilterIndex > 0) {
        newIndex = currentFilterIndex - 1;
      }
      
      if (newIndex !== currentFilterIndex) {
        setCurrentFilterIndex(newIndex);
        onFilterChange(filters[newIndex].style);
        setShowFilterName(true);
        setTimeout(() => setShowFilterName(false), 1500);
        setTouchStartX(clientX); // Reset for continuous swiping
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleInteractionStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleInteractionMove(e.touches[0].clientX);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleInteractionStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMouseDown) {
      handleInteractionMove(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  return {
    currentFilterIndex,
    showFilterName,
    handleTouchStart,
    handleTouchMove,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};