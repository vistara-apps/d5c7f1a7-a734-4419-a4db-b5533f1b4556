import { Redis } from '@upstash/redis';
import { User, Project, Collaboration, Task, CollaborationRequest, MatchScore } from './types';
import { DB_KEYS, INDEX_KEYS } from './db-schema';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// User operations
export async function createUser(user: User): Promise<User> {
  const userKey = `${DB_KEYS.USER}${user.userId}`;

  // Store user data
  await redis.hset(userKey, {
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  });

  // Create indexes
  if (user.farcasterId) {
    await redis.hset(INDEX_KEYS.USERS_BY_FARCASTER_ID, { [user.farcasterId as string]: user.userId });
  }
  if (user.ethAddress) {
    await redis.hset(INDEX_KEYS.USERS_BY_ETH_ADDRESS, { [user.ethAddress as string]: user.userId });
  }

  return user;
}

export async function getUser(userId: string): Promise<User | null> {
  const userKey = `${DB_KEYS.USER}${userId}`;
  const user = await redis.hgetall(userKey);

  if (!user || Object.keys(user).length === 0) {
    return null;
  }

  return {
    ...user,
    createdAt: new Date(user.createdAt as string),
    updatedAt: new Date(user.updatedAt as string),
  } as User;
}

export async function getUserByFarcasterId(farcasterId: string): Promise<User | null> {
  const userId = await redis.hget(INDEX_KEYS.USERS_BY_FARCASTER_ID, farcasterId);
  if (!userId) return null;

  return getUser(userId as string);
}

export async function getUserByEthAddress(ethAddress: string): Promise<User | null> {
  const userId = await redis.hget(INDEX_KEYS.USERS_BY_ETH_ADDRESS, ethAddress);
  if (!userId) return null;

  return getUser(userId as string);
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  const user = await getUser(userId);
  if (!user) return null;

  const updatedUser = { ...user, ...updates, updatedAt: new Date() };
  const userKey = `${DB_KEYS.USER}${userId}`;

  await redis.hset(userKey, {
    ...updatedUser,
    createdAt: updatedUser.createdAt.toISOString(),
    updatedAt: updatedUser.updatedAt.toISOString(),
  });

  // Update indexes if farcasterId or ethAddress changed
  if (updates.farcasterId && updates.farcasterId !== user.farcasterId) {
    if (user.farcasterId) {
      await redis.hdel(INDEX_KEYS.USERS_BY_FARCASTER_ID, user.farcasterId);
    }
    await redis.hset(INDEX_KEYS.USERS_BY_FARCASTER_ID, { [updates.farcasterId as string]: userId });
  }

  if (updates.ethAddress && updates.ethAddress !== user.ethAddress) {
    if (user.ethAddress) {
      await redis.hdel(INDEX_KEYS.USERS_BY_ETH_ADDRESS, user.ethAddress);
    }
    await redis.hset(INDEX_KEYS.USERS_BY_ETH_ADDRESS, { [updates.ethAddress as string]: userId });
  }

  return updatedUser;
}

// Project operations
export async function createProject(project: Project): Promise<Project> {
  const projectKey = `${DB_KEYS.PROJECT}${project.projectId}`;

  await redis.hset(projectKey, {
    ...project,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  });

  // Add to creator's projects
  const userProjectsKey = `${DB_KEYS.USER_PROJECTS}${project.creatorUserId}`;
  await redis.sadd(userProjectsKey, project.projectId);

  // Add to projects by creator index
  await redis.sadd(`${INDEX_KEYS.PROJECTS_BY_CREATOR}:${project.creatorUserId}`, project.projectId);

  return project;
}

export async function getProject(projectId: string): Promise<Project | null> {
  const projectKey = `${DB_KEYS.PROJECT}${projectId}`;
  const project = await redis.hgetall(projectKey);

  if (!project || Object.keys(project).length === 0) {
    return null;
  }

  return {
    ...project,
    createdAt: new Date(project.createdAt as string),
    updatedAt: new Date(project.updatedAt as string),
  } as Project;
}

export async function getProjectsByCreator(creatorUserId: string): Promise<Project[]> {
  const projectIds = await redis.smembers(`${INDEX_KEYS.PROJECTS_BY_CREATOR}:${creatorUserId}`);
  const projects: Project[] = [];

  for (const projectId of projectIds) {
    const project = await getProject(projectId);
    if (project) {
      projects.push(project);
    }
  }

  return projects;
}

export async function updateProject(projectId: string, updates: Partial<Project>): Promise<Project | null> {
  const project = await getProject(projectId);
  if (!project) return null;

  const updatedProject = { ...project, ...updates, updatedAt: new Date() };
  const projectKey = `${DB_KEYS.PROJECT}${projectId}`;

  await redis.hset(projectKey, updatedProject);

  return updatedProject;
}

// Collaboration operations
export async function createCollaboration(collaboration: Collaboration): Promise<Collaboration> {
  const collaborationKey = `${DB_KEYS.COLLABORATION}${collaboration.collaborationId}`;

  await redis.hset(collaborationKey, {
    ...collaboration,
    joinedAt: collaboration.joinedAt.toISOString(),
  });

  // Add to project collaborators
  const projectCollaboratorsKey = `${DB_KEYS.PROJECT_COLLABORATORS}${collaboration.projectId}`;
  await redis.sadd(projectCollaboratorsKey, collaboration.userId);

  // Add to user's collaborations
  const userCollaborationsKey = `${DB_KEYS.USER_COLLABORATIONS}${collaboration.userId}`;
  await redis.sadd(userCollaborationsKey, collaboration.collaborationId);

  // Add to indexes
  await redis.sadd(`${INDEX_KEYS.COLLABORATIONS_BY_PROJECT}:${collaboration.projectId}`, collaboration.collaborationId);
  await redis.sadd(`${INDEX_KEYS.COLLABORATIONS_BY_USER}:${collaboration.userId}`, collaboration.collaborationId);

  return collaboration;
}

export async function getCollaboration(collaborationId: string): Promise<Collaboration | null> {
  const collaborationKey = `${DB_KEYS.COLLABORATION}${collaborationId}`;
  const collaboration = await redis.hgetall(collaborationKey);

  if (!collaboration || Object.keys(collaboration).length === 0) {
    return null;
  }

  return {
    ...collaboration,
    joinedAt: new Date(collaboration.joinedAt as string),
  } as Collaboration;
}

export async function getCollaborationsByProject(projectId: string): Promise<Collaboration[]> {
  const collaborationIds = await redis.smembers(`${INDEX_KEYS.COLLABORATIONS_BY_PROJECT}:${projectId}`);
  const collaborations: Collaboration[] = [];

  for (const collaborationId of collaborationIds) {
    const collaboration = await getCollaboration(collaborationId);
    if (collaboration) {
      collaborations.push(collaboration);
    }
  }

  return collaborations;
}

export async function getCollaborationsByUser(userId: string): Promise<Collaboration[]> {
  const collaborationIds = await redis.smembers(`${INDEX_KEYS.COLLABORATIONS_BY_USER}:${userId}`);
  const collaborations: Collaboration[] = [];

  for (const collaborationId of collaborationIds) {
    const collaboration = await getCollaboration(collaborationId);
    if (collaboration) {
      collaborations.push(collaboration);
    }
  }

  return collaborations;
}

export async function updateCollaboration(collaborationId: string, updates: Partial<Collaboration>): Promise<Collaboration | null> {
  const existingCollaboration = await getCollaboration(collaborationId);
  if (!existingCollaboration) return null;

  const updatedCollaboration = { ...existingCollaboration, ...updates };
  const collaborationKey = `${DB_KEYS.COLLABORATION}${collaborationId}`;

  await redis.hset(collaborationKey, {
    ...updatedCollaboration,
    joinedAt: updatedCollaboration.joinedAt.toISOString(),
  });

  return updatedCollaboration;
}

// Task operations
export async function createTask(task: Task): Promise<Task> {
  const taskKey = `${DB_KEYS.TASK}${task.taskId}`;

  await redis.hset(taskKey, {
    ...task,
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
  });

  // Add to tasks by project index
  await redis.sadd(`${INDEX_KEYS.TASKS_BY_PROJECT}:${task.projectId}`, task.taskId);

  return task;
}

export async function getTask(taskId: string): Promise<Task | null> {
  const taskKey = `${DB_KEYS.TASK}${taskId}`;
  const task = await redis.hgetall(taskKey);

  if (!task || Object.keys(task).length === 0) {
    return null;
  }

  return {
    ...task,
    dueDate: task.dueDate ? new Date(task.dueDate as string) : undefined,
  } as Task;
}

export async function getTasksByProject(projectId: string): Promise<Task[]> {
  const taskIds = await redis.smembers(`${INDEX_KEYS.TASKS_BY_PROJECT}:${projectId}`);
  const tasks: Task[] = [];

  for (const taskId of taskIds) {
    const task = await getTask(taskId);
    if (task) {
      tasks.push(task);
    }
  }

  return tasks;
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<Task | null> {
  const task = await getTask(taskId);
  if (!task) return null;

  const updatedTask = { ...task, ...updates };
  const taskKey = `${DB_KEYS.TASK}${taskId}`;

  await redis.hset(taskKey, updatedTask);

  return updatedTask;
}

// Collaboration Request operations
export async function createCollaborationRequest(request: CollaborationRequest): Promise<CollaborationRequest> {
  const requestKey = `${DB_KEYS.COLLABORATION_REQUEST}${request.id}`;

  await redis.hset(requestKey, {
    ...request,
    createdAt: request.createdAt.toISOString(),
  });

  // Add to user's requests index
  await redis.sadd(`${INDEX_KEYS.COLLAB_REQUESTS_BY_USER}:${request.toUserId}`, request.id);

  return request;
}

export async function getCollaborationRequest(requestId: string): Promise<CollaborationRequest | null> {
  const requestKey = `${DB_KEYS.COLLABORATION_REQUEST}${requestId}`;
  const request = await redis.hgetall(requestKey);

  if (!request || Object.keys(request).length === 0) {
    return null;
  }

  return {
    ...request,
    createdAt: new Date(request.createdAt as string),
  } as CollaborationRequest;
}

export async function getCollaborationRequestsByUser(userId: string): Promise<CollaborationRequest[]> {
  const requestIds = await redis.smembers(`${INDEX_KEYS.COLLAB_REQUESTS_BY_USER}:${userId}`);
  const requests: CollaborationRequest[] = [];

  for (const requestId of requestIds) {
    const request = await getCollaborationRequest(requestId);
    if (request) {
      requests.push(request);
    }
  }

  return requests;
}

export async function updateCollaborationRequest(requestId: string, updates: Partial<CollaborationRequest>): Promise<CollaborationRequest | null> {
  const request = await getCollaborationRequest(requestId);
  if (!request) return null;

  const updatedRequest = { ...request, ...updates };
  const requestKey = `${DB_KEYS.COLLABORATION_REQUEST}${requestId}`;

  await redis.hset(requestKey, updatedRequest);

  return updatedRequest;
}

// Utility functions
export async function searchUsers(query: string, limit: number = 20): Promise<User[]> {
  // Simple search implementation - in production, consider using Redisearch
  const allUserKeys = await redis.keys(`${DB_KEYS.USER}*`);
  const users: User[] = [];

  for (const userKey of allUserKeys.slice(0, limit * 2)) { // Get more than needed for filtering
    const user = await redis.hgetall(userKey);
    if (user && typeof user === 'object' && Object.keys(user).length > 0) {
      const userData = {
        ...user,
        createdAt: new Date(user.createdAt as string),
        updatedAt: new Date(user.updatedAt as string),
      } as User;
      if (
        userData.displayName.toLowerCase().includes(query.toLowerCase()) ||
        userData.bio.toLowerCase().includes(query.toLowerCase()) ||
        userData.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase())) ||
        userData.goals.some(goal => goal.toLowerCase().includes(query.toLowerCase()))
      ) {
        users.push(userData);
        if (users.length >= limit) break;
      }
    }
  }

  return users;
}

export async function getMatchScores(userId: string): Promise<Record<string, MatchScore>> {
  const matchScoresKey = `${DB_KEYS.MATCH_SCORES}${userId}`;
  const matchScores = await redis.hgetall(matchScoresKey);

  const result: Record<string, MatchScore> = {};
  if (matchScores) {
    for (const [key, value] of Object.entries(matchScores)) {
      result[key] = JSON.parse(value as string);
    }
  }

  return result;
}

export async function setMatchScore(userId: string, targetUserId: string, matchScore: MatchScore): Promise<void> {
  const matchScoresKey = `${DB_KEYS.MATCH_SCORES}${userId}`;
  await redis.hset(matchScoresKey, { [targetUserId]: JSON.stringify(matchScore) });
}

// Project search operations
export async function searchProjects(query: string, limit: number = 20): Promise<Project[]> {
  // Simple search implementation - in production, consider using Redisearch
  const allProjectKeys = await redis.keys(`${DB_KEYS.PROJECT}*`);
  const projects: Project[] = [];

  for (const projectKey of allProjectKeys.slice(0, limit * 2)) { // Get more than needed for filtering
    const project = await redis.hgetall(projectKey);
    if (project && typeof project === 'object' && Object.keys(project).length > 0) {
      const projectData = {
        ...project,
        createdAt: new Date(project.createdAt as string),
        updatedAt: new Date(project.updatedAt as string),
      } as Project;
      if (
        projectData.projectName.toLowerCase().includes(query.toLowerCase()) ||
        projectData.description.toLowerCase().includes(query.toLowerCase()) ||
        projectData.goals.some(goal => goal.toLowerCase().includes(query.toLowerCase()))
      ) {
        projects.push(projectData);
        if (projects.length >= limit) break;
      }
    }
  }

  return projects;
}
