export interface User {
  userId: string;
  farcasterId?: string;
  displayName: string;
  bio: string;
  skills: string[];
  values: string[];
  goals: string[];
  ethAddress?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  projectId: string;
  projectName: string;
  description: string;
  goals: string[];
  milestones: Milestone[];
  status: 'draft' | 'active' | 'completed' | 'paused';
  createdAt: Date;
  updatedAt: Date;
  creatorUserId: string;
}

export interface Collaboration {
  collaborationId: string;
  projectId: string;
  userId: string;
  role: string;
  contributionSummary: string;
  mutualBenefitScore: number;
  joinedAt: Date;
}

export interface Task {
  taskId: string;
  projectId: string;
  assignedUserId: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  dueDate?: Date;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate?: Date;
  completed: boolean;
}

export interface CollaborationRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  projectId?: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface MatchScore {
  userId: string;
  score: number;
  matchReasons: string[];
  sharedGoals: string[];
  complementarySkills: string[];
}
