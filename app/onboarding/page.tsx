'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingForm } from '../components/OnboardingForm';
import { FarcasterAuth } from '../components/FarcasterAuth';
import { WalletConnect } from '../components/WalletConnect';
import { FarcasterUser } from '@/lib/farcaster';
import { User } from '@/lib/types';

export default function OnboardingPage() {
  const [step, setStep] = useState<'auth' | 'wallet' | 'profile'>('auth');
  const [farcasterUser, setFarcasterUser] = useState<FarcasterUser | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      // For now, assume user needs to authenticate
      // In real app, check for existing session/token
    };
    checkAuth();
  }, []);

  const handleFarcasterAuth = async (user: FarcasterUser, appUser?: User) => {
    setFarcasterUser(user);
    if (appUser) {
      // User already exists, redirect to dashboard
      router.push('/');
    } else {
      // New user, proceed to wallet connection
      setStep('wallet');
    }
  };

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
    setStep('profile');
  };

  const handleWalletDisconnect = () => {
    setWalletAddress('');
    setStep('auth');
  };

  const handleProfileComplete = async (profileData: any) => {
    if (!farcasterUser) return;

    setIsLoading(true);
    try {
      // Create user profile
      const userData = {
        farcasterId: farcasterUser.fid,
        displayName: profileData.displayName,
        bio: profileData.bio,
        skills: profileData.skills,
        values: profileData.values,
        goals: profileData.goals,
        ethAddress: walletAddress,
      };

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // Redirect to dashboard
        router.push('/');
      } else {
        console.error('Failed to create user profile');
      }
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg via-bg to-surface p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gradient mb-4">
            Join CollabSphere
          </h1>
          <p className="text-muted mb-8">
            Complete your profile to start finding collaborators
          </p>

          {/* Progress Indicator */}
          <div className="flex justify-center space-x-4 mb-8">
            {[
              { step: 'auth', label: 'Connect', completed: !!farcasterUser },
              { step: 'wallet', label: 'Wallet', completed: !!walletAddress },
              { step: 'profile', label: 'Profile', completed: false },
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === item.step
                      ? 'bg-accent text-bg'
                      : item.completed
                      ? 'bg-primary text-bg'
                      : 'bg-surface text-muted'
                  }`}
                >
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm ${step === item.step ? 'text-fg' : 'text-muted'}`}>
                  {item.label}
                </span>
                {index < 2 && (
                  <div className={`w-8 h-0.5 mx-4 ${item.completed ? 'bg-primary' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {step === 'auth' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-fg mb-2">Connect Your Accounts</h2>
              <p className="text-muted">
                Start by connecting your Farcaster account to join the community
              </p>
            </div>

            <FarcasterAuth
              onAuthSuccess={handleFarcasterAuth}
              onAuthError={(error) => console.error('Auth error:', error)}
            />
          </div>
        )}

        {step === 'wallet' && farcasterUser && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-fg mb-2">Connect Your Wallet</h2>
              <p className="text-muted">
                Connect your Base-compatible wallet to enable micro-transactions
              </p>
            </div>

            <WalletConnect
              onConnect={handleWalletConnect}
              onDisconnect={handleWalletDisconnect}
            />

            <div className="flex justify-center">
              <button
                onClick={() => setStep('auth')}
                className="text-muted hover:text-fg transition-colors"
              >
                ← Back to authentication
              </button>
            </div>
          </div>
        )}

        {step === 'profile' && farcasterUser && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-fg mb-2">Complete Your Profile</h2>
              <p className="text-muted">
                Tell us about yourself to find the perfect collaborators
              </p>
            </div>

            <OnboardingForm
              farcasterUser={farcasterUser}
              onComplete={handleProfileComplete}
              isLoading={isLoading}
            />

            <div className="flex justify-center">
              <button
                onClick={() => setStep('wallet')}
                className="text-muted hover:text-fg transition-colors"
                disabled={isLoading}
              >
                ← Back to wallet connection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

