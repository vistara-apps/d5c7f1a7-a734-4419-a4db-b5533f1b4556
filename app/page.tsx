'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from './components/Header';
import { ProfileCard } from './components/ProfileCard';
import { ProjectCard } from './components/ProjectCard';
import { CollaborationRequestCard } from './components/CollaborationRequestCard';
import { FarcasterAuth } from './components/FarcasterAuth';
import { WalletConnect } from './components/WalletConnect';
import { User, Project, CollaborationRequest, MatchScore } from '@/lib/types';
import { calculateMatchScore } from '@/lib/utils';
import { Target, Users, Briefcase, TrendingUp, Search, Plus, LogIn } from 'lucide-react';
import { FarcasterUser } from '@/lib/farcaster';

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [matchedUsers, setMatchedUsers] = useState<(User & { matchScore: MatchScore })[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [requests, setRequests] = useState<CollaborationRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'discover' | 'projects'>('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [farcasterUser, setFarcasterUser] = useState<FarcasterUser | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      // Check if user is authenticated
      // For now, assume user needs to authenticate
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load data:', error);
      setIsLoading(false);
    }
  };

  const loadUserData = async (userId: string) => {
    try {
      // Load current user data
      const userResponse = await fetch(`/api/users/${userId}`);
      if (userResponse.ok) {
        const { user } = await userResponse.json();
        setCurrentUser(user);
      }

      // Load projects
      const projectsResponse = await fetch(`/api/projects?creatorId=${userId}`);
      if (projectsResponse.ok) {
        const { projects } = await projectsResponse.json();
        setProjects(projects);
      }

      // Load collaboration requests
      const requestsResponse = await fetch(`/api/collaborations?userId=${userId}`);
      if (requestsResponse.ok) {
        const { collaborations } = await requestsResponse.json();
        // Convert collaborations to requests format (simplified)
        const mockRequests: CollaborationRequest[] = collaborations.map((collab: any) => ({
          id: collab.collaborationId,
          fromUserId: collab.userId,
          toUserId: userId,
          projectId: collab.projectId,
          message: `Collaboration request for project`,
          status: 'pending',
          createdAt: collab.joinedAt,
        }));
        setRequests(mockRequests);
      }

      // Load and match users
      const usersResponse = await fetch('/api/users?q=');
      if (usersResponse.ok) {
        const { users } = await usersResponse.json();
        if (currentUser) {
          const usersWithScores = users
            .filter((user: User) => user.userId !== currentUser.userId)
            .map((user: User) => ({
              ...user,
              matchScore: calculateMatchScore(currentUser, user),
            }))
            .sort((a: any, b: any) => b.matchScore.score - a.matchScore.score);

          setMatchedUsers(usersWithScores);
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const handleFarcasterAuth = async (user: FarcasterUser, appUser?: User) => {
    setFarcasterUser(user);
    if (appUser) {
      setCurrentUser(appUser);
      await loadUserData(appUser.userId);
    } else {
      // Check if user exists
      try {
        const existingUserResponse = await fetch(`/api/users/${user.fid}`);
        if (existingUserResponse.ok) {
          const { user: existingUser } = await existingUserResponse.json();
          setCurrentUser(existingUser);
          await loadUserData(existingUser.userId);
        } else {
          // Redirect to onboarding
          router.push('/onboarding');
        }
      } catch (error) {
        console.error('Failed to check existing user:', error);
        router.push('/onboarding');
      }
    }
  };

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
    if (currentUser) {
      // Update user with wallet address
      fetch(`/api/users/${currentUser.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ethAddress: address }),
      });
    }
  };

  const handleWalletDisconnect = () => {
    setWalletAddress('');
  };

  const handleCollaborate = async (userId: string) => {
    if (!currentUser) return;

    try {
      // Create collaboration request
      const response = await fetch('/api/collaborations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: null, // General collaboration request
          userId,
          role: 'Collaborator',
        }),
      });

      if (response.ok) {
        alert('Collaboration request sent!');
      }
    } catch (error) {
      console.error('Failed to send collaboration request:', error);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      // Update collaboration request status
      await fetch(`/api/collaborations/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' }),
      });
      alert('Collaboration request accepted!');
      // Reload data
      if (currentUser) {
        await loadUserData(currentUser.userId);
      }
    } catch (error) {
      console.error('Failed to accept request:', error);
    }
  };

  const handleRejectRequest = (requestId: string) => {
    alert(`Collaboration request ${requestId} rejected!`);
  };

  const handleJoinProject = (projectId: string) => {
    alert(`Joined project ${projectId}!`);
  };

  const filteredUsers = matchedUsers.filter(user =>
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
    user.goals.some(goal => goal.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Show auth if not authenticated
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg via-bg to-surface p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gradient mb-4">
              Welcome to CollabSphere
            </h1>
            <p className="text-muted mb-8">
              Connect your accounts to start collaborating
            </p>
          </div>

          <FarcasterAuth
            onAuthSuccess={handleFarcasterAuth}
            onAuthError={(error) => console.error('Auth error:', error)}
          />

          {farcasterUser && (
            <WalletConnect
              onConnect={handleWalletConnect}
              onDisconnect={handleWalletDisconnect}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-6">
            Connect, Create, Collaborate
          </h1>
          <p className="text-xl text-muted max-w-3xl mx-auto mb-8">
            Find like-minded professionals who share your goals, values, and vision. 
            Launch joint ventures and achieve more together.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted" />
              <input
                type="text"
                placeholder="Search by skills, goals, or interests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-surface border border-border rounded-xl text-fg placeholder-muted focus:outline-none focus:border-accent transition-colors duration-200"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">
              <Plus className="h-5 w-5 mr-2" />
              Start New Project
            </button>
            <button className="btn-secondary">
              <Users className="h-5 w-5 mr-2" />
              Browse Collaborators
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-surface/50 p-1 rounded-lg max-w-md mx-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Target },
            { id: 'discover', label: 'Discover', icon: Users },
            { id: 'projects', label: 'Projects', icon: Briefcase },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-accent text-bg font-medium'
                    : 'text-muted hover:text-fg'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-12">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="metric-card text-center">
                <TrendingUp className="h-8 w-8 text-accent mx-auto mb-3" />
                <div className="text-2xl font-bold text-fg">
                  {matchedUsers.length > 0 ? Math.round(matchedUsers[0]?.matchScore.score || 0) : 0}%
                </div>
                <div className="text-sm text-muted">Top Match Score</div>
              </div>
              <div className="metric-card text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-fg">{matchedUsers.length}</div>
                <div className="text-sm text-muted">Potential Matches</div>
              </div>
              <div className="metric-card text-center">
                <Briefcase className="h-8 w-8 text-accent mx-auto mb-3" />
                <div className="text-2xl font-bold text-fg">{projects.length}</div>
                <div className="text-sm text-muted">Active Projects</div>
              </div>
              <div className="metric-card text-center">
                <Target className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-fg">
                  {matchedUsers.reduce((sum, user) => sum + user.matchScore.sharedGoals.length, 0)}
                </div>
                <div className="text-sm text-muted">Shared Goals</div>
              </div>
            </div>

            {/* Collaboration Requests */}
            <section>
              <h2 className="text-2xl font-semibold text-fg mb-6">Collaboration Requests</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {requests.length > 0 ? requests.map((request) => {
                  // For now, create mock user data - in real app, fetch user data
                  const mockFromUser: User = {
                    userId: request.fromUserId,
                    displayName: `User ${request.fromUserId}`,
                    bio: 'Collaborator',
                    skills: [],
                    values: [],
                    goals: [],
                    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  };

                  return (
                    <CollaborationRequestCard
                      key={request.id}
                      request={request}
                      fromUser={mockFromUser}
                      onAccept={handleAcceptRequest}
                      onReject={handleRejectRequest}
                    />
                  );
                }) : (
                  <div className="text-center py-8 text-muted">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No collaboration requests yet</p>
                  </div>
                )}
              </div>
            </section>

            {/* Top Matches */}
            <section>
              <h2 className="text-2xl font-semibold text-fg mb-6">Top Matches</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {matchedUsers.slice(0, 3).map((user) => (
                  <ProfileCard
                    key={user.userId}
                    user={user}
                    matchScore={user.matchScore}
                    onCollaborate={handleCollaborate}
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Discover Tab */}
        {activeTab === 'discover' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-fg mb-4">Discover Collaborators</h2>
              <p className="text-muted max-w-2xl mx-auto">
                Find professionals who share your goals and complement your skills
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.map((user) => (
                <ProfileCard
                  key={user.userId}
                  user={user}
                  variant="detailed"
                  matchScore={user.matchScore}
                  onCollaborate={handleCollaborate}
                />
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-fg mb-2">No matches found</h3>
                <p className="text-muted">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-semibold text-fg mb-4">Your Projects</h2>
                <p className="text-muted max-w-2xl">
                  Manage your active projects and track collaboration progress
                </p>
              </div>
              <button
                onClick={() => router.push('/projects/create')}
                className="btn-primary"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Project
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {projects.length > 0 ? projects.map((project) => (
                <ProjectCard
                  key={project.projectId}
                  project={project}
                  onJoin={handleJoinProject}
                  onView={(id) => router.push(`/projects/${id}`)}
                />
              )) : (
                <div className="col-span-full text-center py-12">
                  <Briefcase className="h-16 w-16 text-muted mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold text-fg mb-2">No projects yet</h3>
                  <p className="text-muted mb-6">Create your first project to start collaborating</p>
                  <button
                    onClick={() => router.push('/projects/create')}
                    className="btn-primary"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Project
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
