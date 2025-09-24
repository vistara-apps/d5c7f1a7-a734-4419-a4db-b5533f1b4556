'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { FarcasterUser } from '@/lib/farcaster';
import { User } from '@/lib/types';
import { SKILLS, VALUES, COLLABORATION_GOALS } from '@/lib/constants';
import { X, Plus } from 'lucide-react';

interface OnboardingFormProps {
  farcasterUser: FarcasterUser;
  onComplete: (profileData: any) => void;
  isLoading?: boolean;
}

export function OnboardingForm({ farcasterUser, onComplete, isLoading }: OnboardingFormProps) {
  const [displayName, setDisplayName] = useState(farcasterUser.displayName);
  const [bio, setBio] = useState(farcasterUser.bio);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleValueToggle = (value: string) => {
    setSelectedValues(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleGoalToggle = (goal: string) => {
    setSelectedGoals(prev =>
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create user object
      const user: User = {
        userId: farcasterUser.fid.toString(),
        farcasterId: farcasterUser.fid.toString(),
        displayName,
        bio,
        skills: selectedSkills,
        values: selectedValues,
        goals: selectedGoals,

        avatar: farcasterUser.pfpUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Submit to API
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      const { user: createdUser } = await response.json();
      onComplete({
        displayName,
        bio,
        skills: selectedSkills,
        values: selectedValues,
        goals: selectedGoals,
      });
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Complete Your Profile</CardTitle>
        <CardDescription>
          Tell us about your skills, values, and collaboration goals to find the perfect matches
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium mb-2">
                Display Name
              </label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
                required
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium mb-2">
                Bio
              </label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself and your collaboration style"
                rows={3}
                required
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Skills (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    selectedSkills.includes(skill)
                      ? 'bg-accent text-bg border-accent'
                      : 'bg-surface border-border text-fg hover:border-accent/50'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            {selectedSkills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {selectedSkills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleSkillToggle(skill)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Values */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Values (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {VALUES.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleValueToggle(value)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    selectedValues.includes(value)
                      ? 'bg-primary text-bg border-primary'
                      : 'bg-surface border-border text-fg hover:border-primary/50'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            {selectedValues.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {selectedValues.map((value) => (
                  <Badge key={value} variant="outline" className="text-xs">
                    {value}
                    <button
                      type="button"
                      onClick={() => handleValueToggle(value)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Goals */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Collaboration Goals (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {COLLABORATION_GOALS.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => handleGoalToggle(goal)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    selectedGoals.includes(goal)
                      ? 'bg-accent text-bg border-accent'
                      : 'bg-surface border-border text-fg hover:border-accent/50'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
            {selectedGoals.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {selectedGoals.map((goal) => (
                  <Badge key={goal} variant="secondary" className="text-xs">
                    {goal}
                    <button
                      type="button"
                      onClick={() => handleGoalToggle(goal)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting || selectedSkills.length === 0 || selectedGoals.length === 0}
            className="w-full"
            size="lg"
          >
            {(isSubmitting || isLoading) ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Profile...
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                Complete Setup
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
