'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectForm } from '../../components/ProjectForm';
import { Header } from '../../components/Header';
import { User } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';

export default function CreateProjectPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // For now, create a mock user - in real app, get from session/auth
      const mockUser: User = {
        userId: 'user_123',
        displayName: 'John Doe',
        bio: 'Full-stack developer passionate about Web3',
        skills: ['React', 'TypeScript', 'Solidity'],
        values: ['Open Source', 'Innovation'],
        goals: ['Build DeFi protocols', 'Create educational content'],
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCurrentUser(mockUser);
    } catch (error) {
      console.error('Failed to check auth:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectCreate = async (projectData: any) => {
    if (!currentUser) return;

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...projectData,
          creatorUserId: currentUser.userId,
        }),
      });

      if (response.ok) {
        const { project } = await response.json();
        router.push(`/projects/${project.projectId}`);
      } else {
        console.error('Failed to create project');
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!currentUser) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-muted hover:text-fg transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gradient mb-4">
              Create New Project
            </h1>
            <p className="text-muted max-w-2xl mx-auto">
              Define your project vision and set up the foundation for successful collaboration.
              Choose from templates or start from scratch.
            </p>
          </div>
        </div>

        {/* Project Form */}
        <div className="bg-surface/50 backdrop-blur-sm rounded-2xl p-8 border border-border">
          <ProjectForm
            onSubmit={handleProjectCreate}
            onCancel={() => router.back()}
          />
        </div>
      </main>
    </div>
  );
}

