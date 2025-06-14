import React from 'react';
import { Filter } from '../types';

interface FilterNameDisplayProps {
  showFilterName: boolean;
  currentFilterIndex: number;
  filters: Filter[];
}

const FilterNameDisplay: React.FC<FilterNameDisplayProps> = ({
  showFilterName,
  currentFilterIndex,
  filters
}) => {
  if (!showFilterName) return null;

  return (
    <div className="absolute top-1/2 left-0 right-0 text-center">
      <div className="inline-block bg-black/60 px-6 py-3 rounded-full animate-fade-in">
        <p className="text-white text-lg font-semibold">
          {filters[currentFilterIndex].name}
        </p>
      </div>
    </div>
  );
};

export default FilterNameDisplay;