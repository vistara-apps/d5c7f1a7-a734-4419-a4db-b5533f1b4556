'use client';

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProfileCard } from './components/ProfileCard';
import { ProjectCard } from './components/ProjectCard';
import { CollaborationRequestCard } from './components/CollaborationRequestCard';
import { User, Project, CollaborationRequest, MatchScore } from '@/lib/types';
import { calculateMatchScore, generateId } from '@/lib/utils';
import { SKILLS, VALUES, COLLABORATION_GOALS } from '@/lib/constants';
import { Target, Users, Briefcase, TrendingUp, Search, Plus } from 'lucide-react';

// Mock data for demonstration
const mockCurrentUser: User = {
  userId: 'current-user',
  farcasterId: 'current-user-fid',
  displayName: 'Alex Chen',
  bio: 'Full-stack developer passionate about AI and decentralized systems',
  skills: ['Frontend Development', 'Backend Development', 'AI/ML', 'Blockchain Development'],
  values: ['Open Source', 'Innovation', 'AI Ethics', 'Decentralization'],
  goals: ['Build an AI Art Generator', 'Launch a DeFi Protocol', 'Create Educational Content'],
  ethAddress: '0x1234...5678',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-20'),
};

const mockUsers: User[] = [
  {
    userId: 'user-1',
    displayName: 'Sarah Kim',
    bio: 'UI/UX Designer with a passion for creating beautiful, accessible interfaces',
    skills: ['UI/UX Design', 'Frontend Development', 'Product Management'],
    values: ['Accessibility', 'Innovation', 'Open Source'],
    goals: ['Build an AI Art Generator', 'Create Educational Content'],
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    userId: 'user-2',
    displayName: 'Marcus Johnson',
    bio: 'Blockchain developer and DeFi enthusiast building the future of finance',
    skills: ['Smart Contracts', 'Blockchain Development', 'Backend Development'],
    values: ['Decentralization', 'Transparency', 'Innovation'],
    goals: ['Launch a DeFi Protocol', 'Build Analytics Tools'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-19'),
  },
  {
    userId: 'user-3',
    displayName: 'Emily Rodriguez',
    bio: 'Content creator and educator focused on making tech accessible to everyone',
    skills: ['Content Creation', 'Marketing', 'Community Management'],
    values: ['Education', 'Accessibility', 'Social Impact'],
    goals: ['Create Educational Content', 'Launch a Podcast'],
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-17'),
  },
];

const mockProjects: Project[] = [
  {
    projectId: 'project-1',
    projectName: 'AI Art Generator Platform',
    description: 'Building a decentralized platform for AI-generated art with fair compensation for artists',
    goals: ['Build an AI Art Generator', 'Launch NFT Collection'],
    milestones: [
      { id: '1', title: 'AI Model Training', description: '', completed: true },
      { id: '2', title: 'Frontend Development', description: '', completed: true },
      { id: '3', title: 'Smart Contract Development', description: '', completed: false },
      { id: '4', title: 'Beta Testing', description: '', completed: false },
      { id: '5', title: 'Mainnet Launch', description: '', completed: false },
    ],
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    creatorUserId: 'current-user',
  },
  {
    projectId: 'project-2',
    projectName: 'DeFi Yield Optimizer',
    description: 'Automated yield farming protocol that maximizes returns across multiple DeFi platforms',
    goals: ['Launch a DeFi Protocol', 'Build Analytics Tools'],
    milestones: [
      { id: '1', title: 'Protocol Design', description: '', completed: true },
      { id: '2', title: 'Smart Contract Development', description: '', completed: false },
      { id: '3', title: 'Security Audit', description: '', completed: false },
      { id: '4', title: 'Testnet Launch', description: '', completed: false },
    ],
    status: 'active',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-21'),
    creatorUserId: 'user-2',
  },
];

const mockRequests: CollaborationRequest[] = [
  {
    id: 'req-1',
    fromUserId: 'user-1',
    toUserId: 'current-user',
    projectId: 'project-1',
    message: 'I love your AI art project! I\'d like to help with the UI/UX design and make it more accessible.',
    status: 'pending',
    createdAt: new Date('2024-01-21'),
  },
  {
    id: 'req-2',
    fromUserId: 'user-3',
    toUserId: 'current-user',
    message: 'Your educational content goals align with mine. Want to collaborate on a tech education series?',
    status: 'pending',
    createdAt: new Date('2024-01-20'),
  },
];

export default function HomePage() {
  const [matchedUsers, setMatchedUsers] = useState<(User & { matchScore: MatchScore })[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'discover' | 'projects'>('dashboard');

  useEffect(() => {
    // Calculate match scores for all users
    const usersWithScores = mockUsers.map(user => ({
      ...user,
      matchScore: calculateMatchScore(mockCurrentUser, user),
    })).sort((a, b) => b.matchScore.score - a.matchScore.score);

    setMatchedUsers(usersWithScores);
  }, []);

  const handleCollaborate = (userId: string) => {
    alert(`Collaboration request sent to user ${userId}!`);
  };

  const handleAcceptRequest = (requestId: string) => {
    alert(`Collaboration request ${requestId} accepted!`);
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
                <div className="text-2xl font-bold text-fg">87%</div>
                <div className="text-sm text-muted">Match Score</div>
              </div>
              <div className="metric-card text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-fg">24</div>
                <div className="text-sm text-muted">Potential Matches</div>
              </div>
              <div className="metric-card text-center">
                <Briefcase className="h-8 w-8 text-accent mx-auto mb-3" />
                <div className="text-2xl font-bold text-fg">3</div>
                <div className="text-sm text-muted">Active Projects</div>
              </div>
              <div className="metric-card text-center">
                <Target className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-fg">12</div>
                <div className="text-sm text-muted">Shared Goals</div>
              </div>
            </div>

            {/* Collaboration Requests */}
            <section>
              <h2 className="text-2xl font-semibold text-fg mb-6">Collaboration Requests</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {mockRequests.map((request) => {
                  const fromUser = mockUsers.find(u => u.userId === request.fromUserId);
                  if (!fromUser) return null;
                  
                  return (
                    <CollaborationRequestCard
                      key={request.id}
                      request={request}
                      fromUser={fromUser}
                      onAccept={handleAcceptRequest}
                      onReject={handleRejectRequest}
                    />
                  );
                })}
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
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-fg mb-4">Active Projects</h2>
              <p className="text-muted max-w-2xl mx-auto">
                Explore ongoing projects and find opportunities to contribute
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {mockProjects.map((project) => (
                <ProjectCard
                  key={project.projectId}
                  project={project}
                  onJoin={handleJoinProject}
                  onView={(id) => alert(`Viewing project ${id}`)}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
