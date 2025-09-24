'use client';

import { Project } from '@/lib/types';
import { Calendar, Users, Target, CheckCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  onJoin?: (projectId: string) => void;
  onView?: (projectId: string) => void;
}

export function ProjectCard({ project, onJoin, onView }: ProjectCardProps) {
  const completedMilestones = project.milestones.filter(m => m.completed).length;
  const totalMilestones = project.milestones.length;
  const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  const statusColors = {
    draft: 'bg-gray-500/20 text-gray-400',
    active: 'bg-green-500/20 text-green-400',
    completed: 'bg-accent/20 text-accent',
    paused: 'bg-orange-500/20 text-orange-400',
  };

  return (
    <div className="profile-card animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-fg text-lg">{project.projectName}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
              {project.status}
            </span>
          </div>
          <p className="text-muted text-sm mb-3">{project.description}</p>
        </div>
      </div>

      {/* Goals */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Target className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-fg">Project Goals</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.goals.slice(0, 3).map((goal, index) => (
            <span key={index} className="goal-tag">
              {goal}
            </span>
          ))}
          {project.goals.length > 3 && (
            <span className="text-xs text-muted">+{project.goals.length - 3} more</span>
          )}
        </div>
      </div>

      {/* Progress */}
      {totalMilestones > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-fg">Progress</span>
            <span className="text-sm text-muted">
              {completedMilestones}/{totalMilestones} milestones
            </span>
          </div>
          <div className="w-full bg-surface rounded-full h-2">
            <div
              className="bg-gradient-to-r from-accent to-yellow-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Milestones Preview */}
      {project.milestones.length > 0 && (
        <div className="mb-4">
          <span className="text-sm font-medium text-fg mb-2 block">Next Milestones</span>
          <div className="space-y-2">
            {project.milestones.slice(0, 2).map((milestone) => (
              <div key={milestone.id} className="flex items-center space-x-2">
                <CheckCircle 
                  className={`h-4 w-4 ${milestone.completed ? 'text-green-400' : 'text-muted'}`} 
                />
                <span className={`text-sm ${milestone.completed ? 'text-muted line-through' : 'text-fg'}`}>
                  {milestone.title}
                </span>
                {milestone.dueDate && (
                  <span className="text-xs text-muted">
                    {formatDate(milestone.dueDate)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex items-center space-x-4 text-sm text-muted">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(project.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>Looking for collaborators</span>
          </div>
        </div>

        <div className="flex space-x-2">
          {onView && (
            <button
              onClick={() => onView(project.projectId)}
              className="btn-secondary text-sm px-4 py-2"
            >
              View Details
            </button>
          )}
          {onJoin && project.status === 'active' && (
            <button
              onClick={() => onJoin(project.projectId)}
              className="btn-primary text-sm px-4 py-2"
            >
              Join Project
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
