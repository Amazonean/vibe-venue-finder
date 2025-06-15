import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDebounce } from '@/hooks/useDebounce';
import { supabase } from '@/integrations/supabase/client';

interface VenuesSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLocationSelect?: (location: {lat: number, lng: number}, placeName: string) => void;
}

interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

const VenuesSearchBar: React.FC<VenuesSearchBarProps> = ({ searchQuery, onSearchChange, onLocationSelect }) => {
  const [open, setOpen] = useState(false);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchPredictions = async () => {
      if (debouncedQuery.length < 2) {
        setPredictions([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('google-places-autocomplete', {
          body: { input: debouncedQuery }
        });

        if (error) {
          console.error('Error fetching predictions:', error);
          setPredictions([]);
        } else {
          setPredictions(data?.predictions || []);
        }
      } catch (err) {
        console.error('Failed to fetch predictions:', err);
        setPredictions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPredictions();
  }, [debouncedQuery]);

  const handleSelectPrediction = async (prediction: PlacePrediction) => {
    onSearchChange(prediction.structured_formatting.main_text);
    setOpen(false);
    
    // Get the coordinates for the selected place
    if (onLocationSelect) {
      try {
        const { data, error } = await supabase.functions.invoke('google-places-details', {
          body: { place_id: prediction.place_id }
        });
        
        if (error) {
          console.error('Error fetching place details:', error);
        } else if (data?.location) {
          onLocationSelect(data.location, prediction.structured_formatting.main_text);
        }
      } catch (err) {
        console.error('Failed to fetch place details:', err);
      }
    }
    
    // Keep focus on input after selection
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);
  };

  return (
    <div className="py-3">
      <Popover open={open && predictions.length > 0} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
              <div className="text-muted-foreground flex border-none bg-muted items-center justify-center pl-4 rounded-l-xl border-r-0">
                <Search className="h-6 w-6" />
              </div>
              <Input
                ref={inputRef}
                placeholder="Search for venues"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (e.target.value.length >= 2) {
                    setOpen(true);
                  }
                }}
                onFocus={() => {
                  if (predictions.length > 0 || searchQuery.length >= 2) {
                    setOpen(true);
                  }
                }}
                onClick={() => {
                  if (predictions.length > 0 || searchQuery.length >= 2) {
                    setOpen(true);
                  }
                }}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-foreground focus:outline-0 focus:ring-0 border-none bg-muted focus:border-none h-full placeholder:text-muted-foreground px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
              />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[var(--radix-popover-trigger-width)] p-0 bg-background border-border shadow-lg z-50" 
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <Command>
            <CommandList className="max-h-48">
              {isLoading ? (
                <CommandEmpty>Searching...</CommandEmpty>
              ) : predictions.length === 0 ? (
                <CommandEmpty>No venues found.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {predictions.map((prediction) => (
                    <CommandItem
                      key={prediction.place_id}
                      onSelect={() => handleSelectPrediction(prediction)}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="cursor-pointer hover:bg-accent"
                    >
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">
                          {prediction.structured_formatting.main_text}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {prediction.structured_formatting.secondary_text}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default VenuesSearchBar;