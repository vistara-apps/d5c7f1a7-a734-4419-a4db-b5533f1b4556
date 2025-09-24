'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { PROJECT_TEMPLATES, COLLABORATION_GOALS } from '@/lib/constants';
import { Plus, X, Calendar, Users } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface ProjectFormData {
  projectName: string;
  description: string;
  goals: string[];
  milestones: Milestone[];
  status: 'draft' | 'active';
}

interface ProjectFormProps {
  templateId?: string | null;
  onSubmit: (projectData: any) => void;
  onCancel: () => void;
}

export function ProjectForm({ templateId, onSubmit, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    projectName: '',
    description: '',
    goals: [],
    milestones: [],
    status: 'draft',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (templateId) {
      const template = PROJECT_TEMPLATES.find(t => t.id === templateId);
      if (template) {
        setFormData({
          projectName: `${template.name} Project`,
          description: template.description,
          goals: [],
          milestones: template.milestones.map((title, index) => ({
            id: `milestone-${index + 1}`,
            title,
            description: '',
            completed: false,
          })),
          status: 'draft',
        });
      }
    }
  }, [templateId]);

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: `milestone-${Date.now()}`,
      title: '',
      description: '',
      completed: false,
    };
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, newMilestone]
    }));
  };

  const updateMilestone = (id: string, field: keyof Milestone, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map(m =>
        m.id === id ? { ...m, [field]: value } : m
      )
    }));
  };

  const removeMilestone = (id: string) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter(m => m.id !== id)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mock current user ID - in real app, get from auth context
      const creatorUserId = 'current-user';

      const projectData = {
        ...formData,
        creatorUserId,
      };

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const { project } = await response.json();
      onSubmit(project);
    } catch (error) {
      console.error('Failed to create project:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
        <CardDescription>
          Define your project goals, milestones, and collaboration requirements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium mb-2">
                Project Name *
              </label>
              <Input
                id="projectName"
                value={formData.projectName}
                onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                placeholder="Enter project name"
                required
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-2">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'active' }))}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-fg focus:outline-none focus:border-accent"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description *
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your project and what you're looking to achieve"
              rows={4}
              required
            />
          </div>

          {/* Goals */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Project Goals (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {COLLABORATION_GOALS.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => handleGoalToggle(goal)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    formData.goals.includes(goal)
                      ? 'bg-accent text-bg border-accent'
                      : 'bg-surface border-border text-fg hover:border-accent/50'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
            {formData.goals.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {formData.goals.map((goal) => (
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

          {/* Milestones */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium">
                Milestones
              </label>
              <Button
                type="button"
                onClick={addMilestone}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Milestone
              </Button>
            </div>

            <div className="space-y-4">
              {formData.milestones.map((milestone, index) => (
                <Card key={milestone.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-muted">
                        Milestone {index + 1}
                      </span>
                    </div>
                    <Button
                      type="button"
                      onClick={() => removeMilestone(milestone.id)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <Input
                      value={milestone.title}
                      onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                      placeholder="Milestone title"
                      required
                    />
                    <Textarea
                      value={milestone.description}
                      onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                      placeholder="Describe what needs to be accomplished"
                      rows={2}
                    />
                  </div>
                </Card>
              ))}

              {formData.milestones.length === 0 && (
                <div className="text-center py-8 text-muted">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No milestones added yet</p>
                  <p className="text-sm">Add milestones to track your project progress</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.projectName || !formData.description}
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Project...
                </>
              ) : (
                <>
                  <Users className="h-5 w-5 mr-2" />
                  Create Project
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
