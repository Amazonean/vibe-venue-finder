// Update this page (the content is just a fallback if you fail to update the page)

import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MapPin, Music, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        {/* Large Logo */}
        <div className="text-center mb-12">
          <img 
            src="/lovable-uploads/d02d0cde-dea2-47bf-818c-e801d38a92a9.png" 
            alt="TurntUp Logo" 
            className="h-60 w-auto mx-auto sm:h-72 md:h-96"
          />
        </div>
        
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Find Your Vibe
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Discover the perfect venues around you. Check real-time vibes, connect with the scene, 
            and find where the energy matches your mood.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => navigate(user ? '/venues' : '/auth')}
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
            >
              {user ? 'Explore Venues' : 'Get Started'}
            </Button>
            {!user && (
              <Button 
                onClick={() => navigate('/auth')}
                variant="outline"
                size="lg" 
                className="px-8 py-3 text-lg"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Location-Based Discovery</h3>
            <p className="text-muted-foreground">
              Find venues near you with real-time distance calculations and location-based recommendations.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Real-Time Vibes</h3>
            <p className="text-muted-foreground">
              Check current vibe levels from chill to turnt, updated by the community in real-time.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Community Driven</h3>
            <p className="text-muted-foreground">
              Vote on venue vibes and help others discover the perfect spot for their night out.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
