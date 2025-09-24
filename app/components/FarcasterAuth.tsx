'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { getFarcasterContext, FarcasterUser } from '@/lib/farcaster';
import { User } from '@/lib/types';

interface FarcasterAuthProps {
  onAuthSuccess: (farcasterUser: FarcasterUser, appUser?: User) => void;
  onAuthError: (error: string) => void;
}

export function FarcasterAuth({ onAuthSuccess, onAuthError }: FarcasterAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [farcasterUser, setFarcasterUser] = useState<FarcasterUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const context = await getFarcasterContext();
      if (context) {
        setFarcasterUser(context.user);
        setIsAuthenticated(true);
        onAuthSuccess(context.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would trigger Farcaster authentication
      // For now, simulate authentication
      const mockUser: FarcasterUser = {
        fid: 12345,
        username: 'testuser',
        displayName: 'Test User',
        bio: 'A test user on Farcaster',
        pfpUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        followerCount: 100,
        followingCount: 50,
      };

      setFarcasterUser(mockUser);
      setIsAuthenticated(true);
      onAuthSuccess(mockUser);
    } catch (error) {
      onAuthError('Failed to authenticate with Farcaster');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated && farcasterUser) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={farcasterUser.pfpUrl} alt={farcasterUser.displayName} />
              <AvatarFallback>{farcasterUser.displayName.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-lg">{farcasterUser.displayName}</CardTitle>
          <CardDescription>@{farcasterUser.username}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary">
              {farcasterUser.followerCount} followers
            </Badge>
            <Badge variant="secondary">
              {farcasterUser.followingCount} following
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            {farcasterUser.bio}
          </p>
          <div className="flex justify-center">
            <Badge variant="outline" className="text-accent border-accent">
              ✓ Connected to Farcaster
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Connect with Farcaster</CardTitle>
        <CardDescription>
          Sign in with your Farcaster account to access CollabSphere
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleAuth}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Connecting...
            </>
          ) : (
            <>
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Sign in with Farcaster
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
