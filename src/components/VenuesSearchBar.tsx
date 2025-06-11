import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface VenuesSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const VenuesSearchBar: React.FC<VenuesSearchBarProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="py-3">
      <label className="flex flex-col min-w-40 h-12 w-full">
        <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
          <div className="text-muted-foreground flex border-none bg-muted items-center justify-center pl-4 rounded-l-xl border-r-0">
            <Search className="h-6 w-6" />
          </div>
          <Input
            placeholder="Search for venues"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-foreground focus:outline-0 focus:ring-0 border-none bg-muted focus:border-none h-full placeholder:text-muted-foreground px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
          />
        </div>
      </label>
    </div>
  );
};

export default VenuesSearchBar;