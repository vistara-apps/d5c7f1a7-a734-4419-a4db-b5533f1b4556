'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '../../components/Header';
import { ProjectCard } from '../../components/ProjectCard';
import { CollaborationRequestCard } from '../../components/CollaborationRequestCard';
import { Project, User, Collaboration, Task, CollaborationRequest } from '@/lib/types';
import { ArrowLeft, Users, Target, Calendar, CheckCircle, Clock, Plus } from 'lucide-react';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [creator, setCreator] = useState<User | null>(null);
  const [collaborators, setCollaborators] = useState<(Collaboration & { user: User })[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [requests, setRequests] = useState<CollaborationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      // Load project
      const projectResponse = await fetch(`/api/projects/${projectId}`);
      if (projectResponse.ok) {
        const { project: projectData } = await projectResponse.json();
        setProject(projectData);

        // Load creator
        const creatorResponse = await fetch(`/api/users/${projectData.creatorUserId}`);
        if (creatorResponse.ok) {
          const { user } = await creatorResponse.json();
          setCreator(user);
        }
      }

      // Load collaborators
      const collabResponse = await fetch(`/api/collaborations?projectId=${projectId}`);
      if (collabResponse.ok) {
        const { collaborations } = await collabResponse.json();
        // Load user data for each collaborator
        const collaboratorsWithUsers = await Promise.all(
          collaborations.map(async (collab: Collaboration) => {
            const userResponse = await fetch(`/api/users/${collab.userId}`);
            const { user } = await userResponse.json();
            return { ...collab, user };
          })
        );
        setCollaborators(collaboratorsWithUsers);
      }

      // Load tasks
      const tasksResponse = await fetch(`/api/tasks?projectId=${projectId}`);
      if (tasksResponse.ok) {
        const { tasks: tasksData } = await tasksResponse.json();
        setTasks(tasksData);
      }

      // Mock current user - in real app, get from auth
      const mockUser: User = {
        userId: 'user_123',
        displayName: 'John Doe',
        bio: 'Full-stack developer',
        skills: ['React', 'TypeScript'],
        values: ['Innovation'],
        goals: ['Build great products'],
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCurrentUser(mockUser);

    } catch (error) {
      console.error('Failed to load project data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinProject = async () => {
    if (!currentUser || !project) return;

    try {
      const response = await fetch('/api/collaborations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.projectId,
          userId: currentUser.userId,
          role: 'Collaborator',
        }),
      });

      if (response.ok) {
        // Reload data
        loadProjectData();
      }
    } catch (error) {
      console.error('Failed to join project:', error);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await fetch(`/api/collaborations/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' }),
      });
      // Reload data
      loadProjectData();
    } catch (error) {
      console.error('Failed to accept request:', error);
    }
  };

  const handleRejectRequest = (requestId: string) => {
    // Handle reject
    console.log('Rejected request:', requestId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-fg mb-4">Project Not Found</h1>
          <button
            onClick={() => router.back()}
            className="btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isCreator = currentUser?.userId === project.creatorUserId;
  const isCollaborator = collaborators.some(c => c.userId === currentUser?.userId);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-muted hover:text-fg transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Header */}
            <div className="bg-surface/50 backdrop-blur-sm rounded-2xl p-8 border border-border">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-fg mb-2">{project.projectName}</h1>
                  <p className="text-muted mb-4">{project.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Created {project.createdAt.toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'active' ? 'bg-green-100 text-green-800' :
                      project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                {!isCreator && !isCollaborator && (
                  <button
                    onClick={handleJoinProject}
                    className="btn-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Join Project
                  </button>
                )}
              </div>

              {/* Goals */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-fg mb-3 flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Project Goals
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.goals.map((goal, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              </div>

              {/* Milestones */}
              <div>
                <h3 className="text-lg font-semibold text-fg mb-3">Milestones</h3>
                <div className="space-y-3">
                  {project.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-bg/50 rounded-lg">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        milestone.completed ? 'bg-green-500' : 'bg-muted'
                      }`}>
                        {milestone.completed ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : (
                          <Clock className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-fg">{milestone.title}</h4>
                        <p className="text-sm text-muted">{milestone.description}</p>
                        {milestone.dueDate && (
                          <p className="text-xs text-muted mt-1">
                            Due: {milestone.dueDate.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tasks */}
            <div className="bg-surface/50 backdrop-blur-sm rounded-2xl p-8 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-fg">Tasks</h2>
                {(isCreator || isCollaborator) && (
                  <button className="btn-secondary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {tasks.length > 0 ? tasks.map((task) => (
                  <div key={task.taskId} className="flex items-center justify-between p-4 bg-bg/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${
                        task.status === 'completed' ? 'bg-green-500' :
                        task.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-300'
                      }`} />
                      <div>
                        <h4 className="font-medium text-fg">{task.description}</h4>
                        <p className="text-sm text-muted">Assigned to: {task.assignedUserId}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      task.status === 'completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                )) : (
                  <div className="text-center py-8 text-muted">
                    <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No tasks yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Creator */}
            {creator && (
              <div className="bg-surface/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
                <h3 className="text-lg font-semibold text-fg mb-4">Project Creator</h3>
                <div className="flex items-center space-x-3">
                  <img
                    src={creator.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
                    alt={creator.displayName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-fg">{creator.displayName}</p>
                    <p className="text-sm text-muted">{creator.bio}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Collaborators */}
            <div className="bg-surface/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
              <h3 className="text-lg font-semibold text-fg mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Collaborators ({collaborators.length})
              </h3>

              <div className="space-y-3">
                {collaborators.map((collab) => (
                  <div key={collab.collaborationId} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={collab.user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'}
                        alt={collab.user.displayName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-fg text-sm">{collab.user.displayName}</p>
                        <p className="text-xs text-muted">{collab.role}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted">
                      {collab.mutualBenefitScore}%
                    </span>
                  </div>
                ))}

                {collaborators.length === 0 && (
                  <p className="text-sm text-muted">No collaborators yet</p>
                )}
              </div>
            </div>

            {/* Collaboration Requests */}
            {isCreator && requests.length > 0 && (
              <div className="bg-surface/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
                <h3 className="text-lg font-semibold text-fg mb-4">Join Requests</h3>
                <div className="space-y-3">
                  {requests.map((request) => (
                    <CollaborationRequestCard
                      key={request.id}
                      request={request}
                      fromUser={{
                        userId: request.fromUserId,
                        displayName: `User ${request.fromUserId}`,
                        bio: 'Potential collaborator',
                        skills: [],
                        values: [],
                        goals: [],
                        createdAt: new Date(),
                        updatedAt: new Date(),
                      }}
                      onAccept={handleAcceptRequest}
                      onReject={handleRejectRequest}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
