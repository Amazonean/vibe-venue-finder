import React from 'react';
import { Button } from '@/components/ui/button';

interface VibeFilterProps {
  selectedVibes: string[];
  onVibeChange: (vibes: string[]) => void;
}

const vibeOptions = [
  { value: 'all', label: 'All Vibes', emoji: '🎉' },
  { value: 'quiet', label: 'Quiet', emoji: '😌' },
  { value: 'chill', label: 'Chill', emoji: '🙂' },
  { value: 'turnt', label: 'Turnt', emoji: '🔥' }
];

const VibeFilter: React.FC<VibeFilterProps> = ({ selectedVibes, onVibeChange }) => {
  const handleVibeToggle = (vibe: string) => {
    if (vibe === 'all') {
      onVibeChange([]);
      return;
    }

    const isSelected = selectedVibes.includes(vibe);
    if (isSelected) {
      onVibeChange(selectedVibes.filter(v => v !== vibe));
    } else {
      onVibeChange([...selectedVibes, vibe]);
    }
  };

  return (
    <div>
      <h4 className="text-sm font-medium text-foreground mb-3">Vibe Level</h4>
      <div className="flex flex-wrap gap-2">
        {vibeOptions.map((option) => {
          const isSelected = option.value === 'all' ? selectedVibes.length === 0 : selectedVibes.includes(option.value);
          return (
            <Button
              key={option.value}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => handleVibeToggle(option.value)}
              className={`text-xs ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground border-border'}`}
            >
              <span className="mr-1">{option.emoji}</span>
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default VibeFilter;