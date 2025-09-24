'use client';

import { CollaborationRequest, User } from '@/lib/types';
import { Avatar, Clock, CheckCircle, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface CollaborationRequestCardProps {
  request: CollaborationRequest;
  fromUser: User;
  variant?: 'pending' | 'accepted' | 'rejected';
  onAccept?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
}

export function CollaborationRequestCard({
  request,
  fromUser,
  variant = 'pending',
  onAccept,
  onReject,
}: CollaborationRequestCardProps) {
  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      borderColor: 'border-yellow-400/20',
    },
    accepted: {
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      borderColor: 'border-green-400/20',
    },
    rejected: {
      icon: X,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
      borderColor: 'border-red-400/20',
    },
  };

  const config = statusConfig[variant];
  const StatusIcon = config.icon;

  return (
    <div className={`profile-card ${config.bgColor} border ${config.borderColor}`}>
      {/* Header */}
      <div className="flex items-start space-x-3 mb-4">
        <div className="relative">
          {fromUser.avatar ? (
            <img
              src={fromUser.avatar}
              alt={fromUser.displayName}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Avatar className="h-5 w-5 text-accent" />
            </div>
          )}
          <div className={`absolute -top-1 -right-1 ${config.bgColor} rounded-full p-1`}>
            <StatusIcon className={`h-3 w-3 ${config.color}`} />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-fg">{fromUser.displayName}</h4>
            <span className="text-xs text-muted">{formatDate(request.createdAt)}</span>
          </div>
          <p className="text-sm text-muted mt-1">wants to collaborate</p>
        </div>
      </div>

      {/* Message */}
      <div className="mb-4">
        <p className="text-sm text-fg bg-surface/50 rounded-lg p-3 border border-border/30">
          "{request.message}"
        </p>
      </div>

      {/* Shared Goals/Skills Preview */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {fromUser.goals.slice(0, 2).map((goal, index) => (
            <span key={index} className="goal-tag text-xs">
              {goal}
            </span>
          ))}
          {fromUser.skills.slice(0, 2).map((skill, index) => (
            <span key={index} className="skill-tag text-xs">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      {variant === 'pending' && (onAccept || onReject) && (
        <div className="flex space-x-2 pt-4 border-t border-border/30">
          {onReject && (
            <button
              onClick={() => onReject(request.id)}
              className="flex-1 bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-lg font-medium hover:bg-red-500/20 transition-colors duration-200"
            >
              Decline
            </button>
          )}
          {onAccept && (
            <button
              onClick={() => onAccept(request.id)}
              className="flex-1 btn-primary"
            >
              Accept
            </button>
          )}
        </div>
      )}

      {/* Status Message */}
      {variant !== 'pending' && (
        <div className={`text-center py-2 text-sm font-medium ${config.color}`}>
          {variant === 'accepted' ? 'Collaboration Accepted' : 'Request Declined'}
        </div>
      )}
    </div>
  );
}
