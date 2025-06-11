import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      path: '/',
    },
    {
      icon: MapPin,
      label: 'Venues',
      path: '/venues',
    },
    {
      icon: User,
      label: 'Profile',
      path: '/profile',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="flex gap-2 border-t border-border bg-sidebar px-4 pb-3 pt-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`just flex flex-1 flex-col items-center justify-end gap-1 rounded-full ${
                isActive ? 'text-primary border border-border bg-muted/20' : 'text-muted-foreground'
              }`}
            >
              <div className="flex h-8 items-center justify-center">
                <Icon className="h-6 w-6" />
              </div>
            </button>
          );
        })}
      </div>
      <div className="h-5 bg-sidebar"></div>
    </div>
  );
};

export default BottomNavigation;