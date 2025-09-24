import { User, Project, Collaboration, Task, CollaborationRequest } from './types';

export interface DatabaseSchema {
  users: Record<string, User>;
  projects: Record<string, Project>;
  collaborations: Record<string, Collaboration>;
  tasks: Record<string, Task>;
  collaborationRequests: Record<string, CollaborationRequest>;
  userProjects: Record<string, string[]>; // userId -> projectIds
  projectCollaborators: Record<string, string[]>; // projectId -> userIds
  userCollaborations: Record<string, string[]>; // userId -> collaborationIds
}

// Redis key patterns
export const DB_KEYS = {
  USER: 'user:',
  PROJECT: 'project:',
  COLLABORATION: 'collaboration:',
  TASK: 'task:',
  COLLABORATION_REQUEST: 'collab_request:',
  USER_PROJECTS: 'user_projects:',
  PROJECT_COLLABORATORS: 'project_collaborators:',
  USER_COLLABORATIONS: 'user_collaborations:',
  MATCH_SCORES: 'match_scores:',
} as const;

// Index keys for efficient lookups
export const INDEX_KEYS = {
  USERS_BY_FARCASTER_ID: 'users_by_farcaster_id',
  USERS_BY_ETH_ADDRESS: 'users_by_eth_address',
  PROJECTS_BY_CREATOR: 'projects_by_creator',
  COLLABORATIONS_BY_PROJECT: 'collaborations_by_project',
  COLLABORATIONS_BY_USER: 'collaborations_by_user',
  TASKS_BY_PROJECT: 'tasks_by_project',
  COLLAB_REQUESTS_BY_USER: 'collab_requests_by_user',
} as const;

