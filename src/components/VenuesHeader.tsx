import React from 'react';
import { Moon, Sun, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';

interface VenuesHeaderProps {}

const VenuesHeader: React.FC<VenuesHeaderProps> = () => {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthAction = async () => {
    if (user) {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out."
      });
    } else {
      navigate('/auth');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isHomePage = location.pathname === '/';

  return (
    <div className="flex items-center justify-between pb-2 bg-background/80 backdrop-blur-sm sticky top-0 z-40 px-4 pt-2">
      <div className="flex items-center">
        {!isHomePage && (
          <img 
            src="/lovable-uploads/aeb22338-3739-4a42-b534-1c81ec69ff48.png" 
            alt="TurntUp Logo" 
            className="h-10 w-auto sm:h-12"
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button 
          onClick={toggleTheme}
          variant="ghost" 
          size="sm"
          className="flex items-center gap-2 text-foreground p-0"
        >
          {theme === 'dark' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
        </Button>
        <Button 
          onClick={handleAuthAction}
          variant="ghost" 
          size="sm"
          className="flex items-center gap-2 text-foreground"
        >
          <User className="h-4 w-4" />
          <span className="text-sm">{user ? 'Sign Out' : 'Sign In'}</span>
        </Button>
      </div>
    </div>
  );
};

export default VenuesHeader;