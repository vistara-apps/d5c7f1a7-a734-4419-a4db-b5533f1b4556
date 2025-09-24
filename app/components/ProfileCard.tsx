'use client';

import { User, MatchScore } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { MessageCircle, Star, Target } from 'lucide-react';
import { truncateText } from '@/lib/utils';

interface ProfileCardProps {
  user: User;
  variant?: 'compact' | 'detailed';
  matchScore?: MatchScore;
  onCollaborate?: (userId: string) => void;
}

export function ProfileCard({ 
  user, 
  variant = 'compact', 
  matchScore,
  onCollaborate 
}: ProfileCardProps) {
  const isDetailed = variant === 'detailed';

  return (
    <div className="profile-card animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.displayName}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Avatar className="h-6 w-6 text-accent" />
              </div>
            )}
            {matchScore && (
              <div className="absolute -top-1 -right-1 bg-accent text-bg text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {matchScore.score}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-fg">{user.displayName}</h3>
            <p className="text-sm text-muted">
              {truncateText(user.bio, isDetailed ? 100 : 50)}
            </p>
          </div>
        </div>
        
        {onCollaborate && (
          <button
            onClick={() => onCollaborate(user.userId)}
            className="btn-primary text-sm px-4 py-2"
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            Collaborate
          </button>
        )}
      </div>

      {/* Match Reasons */}
      {matchScore && matchScore.matchReasons.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Star className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Match Reasons</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {matchScore.matchReasons.map((reason, index) => (
              <span
                key={index}
                className="bg-accent/10 text-accent px-2 py-1 rounded text-xs"
              >
                {reason}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Goals */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Target className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-fg">Goals</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {user.goals.slice(0, isDetailed ? 6 : 3).map((goal, index) => (
            <span key={index} className="goal-tag">
              {goal}
            </span>
          ))}
          {user.goals.length > (isDetailed ? 6 : 3) && (
            <span className="text-xs text-muted">
              +{user.goals.length - (isDetailed ? 6 : 3)} more
            </span>
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <span className="text-sm font-medium text-fg mb-2 block">Skills</span>
        <div className="flex flex-wrap gap-2">
          {user.skills.slice(0, isDetailed ? 8 : 4).map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
            </span>
          ))}
          {user.skills.length > (isDetailed ? 8 : 4) && (
            <span className="text-xs text-muted">
              +{user.skills.length - (isDetailed ? 8 : 4)} more
            </span>
          )}
        </div>
      </div>

      {/* Values (detailed view only) */}
      {isDetailed && user.values.length > 0 && (
        <div>
          <span className="text-sm font-medium text-fg mb-2 block">Values</span>
          <div className="flex flex-wrap gap-2">
            {user.values.slice(0, 6).map((value, index) => (
              <span key={index} className="value-tag">
                {value}
              </span>
            ))}
            {user.values.length > 6 && (
              <span className="text-xs text-muted">
                +{user.values.length - 6} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Shared Goals (if match score available) */}
      {matchScore && matchScore.sharedGoals.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <span className="text-sm font-medium text-accent mb-2 block">Shared Goals</span>
          <div className="flex flex-wrap gap-2">
            {matchScore.sharedGoals.map((goal, index) => (
              <span key={index} className="bg-accent/20 text-accent px-2 py-1 rounded text-xs font-medium">
                {goal}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
