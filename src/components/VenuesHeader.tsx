import React from 'react';
import { Moon, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface VenuesHeaderProps {}

const VenuesHeader: React.FC<VenuesHeaderProps> = () => {
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out."
    });
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex items-center justify-between pb-2">
      <h2 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
        Nightlife
      </h2>
      <div className="flex items-center gap-2">
        <Button 
          onClick={toggleTheme}
          variant="ghost" 
          size="sm"
          className="flex items-center gap-2 text-foreground p-0"
        >
          <Moon className="h-6 w-6" />
        </Button>
        <Button 
          onClick={handleSignOut}
          variant="ghost" 
          size="sm"
          className="flex items-center gap-2 text-foreground p-0"
        >
          <User className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default VenuesHeader;