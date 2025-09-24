'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { PROJECT_TEMPLATES } from '@/lib/constants';
import { FileText, Users, Target, CheckCircle } from 'lucide-react';

interface ProjectTemplateSelectorProps {
  onSelect: (templateId: string) => void;
}

export function ProjectTemplateSelector({ onSelect }: ProjectTemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {PROJECT_TEMPLATES.map((template) => (
        <Card key={template.id} className="hover:border-accent/50 transition-colors cursor-pointer group">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Roles */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-muted" />
                <span className="text-sm font-medium">Suggested Roles</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {template.roles.map((role, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-4 w-4 text-muted" />
                <span className="text-sm font-medium">Milestones</span>
                <Badge variant="secondary" className="text-xs">
                  {template.milestones.length}
                </Badge>
              </div>
              <ul className="space-y-1">
                {template.milestones.slice(0, 3).map((milestone, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-muted">
                    <CheckCircle className="h-3 w-3 text-accent" />
                    <span className="truncate">{milestone}</span>
                  </li>
                ))}
                {template.milestones.length > 3 && (
                  <li className="text-sm text-muted">
                    +{template.milestones.length - 3} more milestones
                  </li>
                )}
              </ul>
            </div>

            {/* Select Button */}
            <Button
              onClick={() => onSelect(template.id)}
              className="w-full group-hover:bg-accent group-hover:text-bg transition-colors"
            >
              Use This Template
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
