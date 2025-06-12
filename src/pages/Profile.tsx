import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Camera, Edit2, Save, X, Trophy, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  username: string | null;
  display_name: string | null;
  full_name: string | null;
  age: number | null;
  avatar_url: string | null;
  created_at: string;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voteCount, setVoteCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [editForm, setEditForm] = useState({
    display_name: '',
    username: ''
  });

  const milestones = [
    { votes: 0, title: "Venue Explorer", emoji: "🔍" },
    { votes: 5, title: "Night Owl", emoji: "🦉" },
    { votes: 15, title: "Vibe Checker", emoji: "✨" },
    { votes: 30, title: "Scene Master", emoji: "👑" },
    { votes: 50, title: "Venue Legend", emoji: "🔥" },
    { votes: 100, title: "TurntUp Ambassador", emoji: "🎉" }
  ];

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchVoteCount();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error loading profile",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setProfile(data);
        setEditForm({
          display_name: data.display_name || '',
          username: data.username || ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVoteCount = async () => {
    if (!user) return;
    
    try {
      const { count, error } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching vote count:', error);
      } else {
        setVoteCount(count || 0);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user || !profile) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      setProfile({ ...profile, avatar_url: publicUrl });
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been successfully updated."
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const getCurrentTitle = () => {
    const sortedMilestones = [...milestones].sort((a, b) => b.votes - a.votes);
    return sortedMilestones.find(milestone => voteCount >= milestone.votes) || milestones[0];
  };

  const getNextMilestone = () => {
    return milestones.find(milestone => voteCount < milestone.votes);
  };

  const getProgressPercentage = () => {
    const nextMilestone = getNextMilestone();
    if (!nextMilestone) return 100;
    
    const previousMilestone = milestones
      .filter(m => m.votes <= voteCount)
      .sort((a, b) => b.votes - a.votes)[0] || milestones[0];
    
    const progress = ((voteCount - previousMilestone.votes) / (nextMilestone.votes - previousMilestone.votes)) * 100;
    return Math.min(progress, 100);
  };

  const handleSaveProfile = async () => {
    if (!user || !profile) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: editForm.display_name,
          username: editForm.username
        })
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Error updating profile",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setProfile({
          ...profile,
          display_name: editForm.display_name,
          username: editForm.username
        });
        setIsEditing(false);
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated."
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out."
    });
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader className="text-center pb-4">
            <div className="relative inline-block">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="text-lg font-semibold">
                  {getInitials(profile.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-3 right-0">
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full w-8 h-8 p-0"
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            {!isEditing ? (
              <>
                <h1 className="text-2xl font-bold text-foreground">
                  {profile.display_name || profile.full_name || 'No name set'}
                </h1>
                <p className="text-muted-foreground">@{profile.username || 'no-username'}</p>
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    value={editForm.display_name}
                    onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                    placeholder="Enter display name"
                  />
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    placeholder="Enter username"
                  />
                </div>
              </div>
            )}
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex justify-center gap-2">
              {!isEditing ? (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({
                        display_name: profile.display_name || '',
                        username: profile.username || ''
                      });
                    }}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* Current Title */}
            <div className="text-center space-y-2 mb-6">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">{getCurrentTitle().emoji}</span>
                <Badge variant="secondary" className="text-sm font-medium">
                  {getCurrentTitle().title}
                </Badge>
              </div>
            </div>

            {/* Voting Progress */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Venue Voting Progress
                </h3>
                <span className="text-sm text-muted-foreground">{voteCount} votes</span>
              </div>
              
              <div className="space-y-2">
                <Progress value={getProgressPercentage()} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Current: {getCurrentTitle().title}</span>
                  {getNextMilestone() && (
                    <span>Next: {getNextMilestone()!.title} ({getNextMilestone()!.votes} votes)</span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-foreground">
                  {profile.age || 'N/A'}
                </div>
                <div className="text-sm text-muted-foreground">Age</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-foreground">{voteCount}</div>
                <div className="text-sm text-muted-foreground">Votes Cast</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Account Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="text-foreground">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member since:</span>
                  <span className="text-foreground">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;