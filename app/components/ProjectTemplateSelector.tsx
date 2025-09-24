'use client';

import { useState } from 'react';
import { PROJECT_TEMPLATES } from '@/lib/constants';
import { CheckCircle, Users, Target } from 'lucide-react';

interface ProjectTemplateSelectorProps {
  onSelect: (templateId: string) => void;
  selectedTemplate?: string;
}

export function ProjectTemplateSelector({ onSelect, selectedTemplate }: ProjectTemplateSelectorProps) {
  const [variant, setVariant] = useState<'preview' | 'selected'>('preview');

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-fg mb-4">Choose a Project Template</h3>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {PROJECT_TEMPLATES.map((template) => {
          const isSelected = selectedTemplate === template.id;
          
          return (
            <div
              key={template.id}
              className={`profile-card cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'border-accent/50 bg-accent/5' 
                  : 'hover:border-accent/30'
              }`}
              onClick={() => onSelect(template.id)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-fg">{template.name}</h4>
                {isSelected && (
                  <CheckCircle className="h-5 w-5 text-accent" />
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-muted mb-4">{template.description}</p>

              {/* Roles */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-fg">Roles</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {template.roles.map((role, index) => (
                    <span key={index} className="skill-tag text-xs">
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Milestones */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-fg">Milestones</span>
                </div>
                <div className="space-y-1">
                  {template.milestones.slice(0, 3).map((milestone, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="h-1.5 w-1.5 bg-muted rounded-full" />
                      <span className="text-xs text-muted">{milestone}</span>
                    </div>
                  ))}
                  {template.milestones.length > 3 && (
                    <div className="flex items-center space-x-2">
                      <div className="h-1.5 w-1.5 bg-muted rounded-full" />
                      <span className="text-xs text-muted">
                        +{template.milestones.length - 3} more milestones
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="mt-4 pt-3 border-t border-accent/20">
                  <div className="text-center text-sm font-medium text-accent">
                    Template Selected
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Custom Template Option */}
      <div
        className={`profile-card cursor-pointer transition-all duration-200 border-dashed ${
          selectedTemplate === 'custom' 
            ? 'border-accent/50 bg-accent/5' 
            : 'hover:border-accent/30'
        }`}
        onClick={() => onSelect('custom')}
      >
        <div className="text-center py-8">
          <div className="flex items-center justify-center mb-3">
            <div className="h-12 w-12 rounded-full bg-surface border-2 border-dashed border-border flex items-center justify-center">
              <Target className="h-6 w-6 text-muted" />
            </div>
            {selectedTemplate === 'custom' && (
              <CheckCircle className="h-5 w-5 text-accent ml-2" />
            )}
          </div>
          <h4 className="font-medium text-fg mb-2">Start from Scratch</h4>
          <p className="text-sm text-muted">Create a custom project template</p>
        </div>
      </div>
    </div>
  );
}
