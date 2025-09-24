import { NextRequest, NextResponse } from 'next/server';
import { createProject, getProjectsByCreator, searchProjects } from '@/lib/db';
import { Project, Milestone } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('creatorId');
    const query = searchParams.get('q') || '';

    if (creatorId) {
      // Get projects by creator
      const projects = await getProjectsByCreator(creatorId);
      return NextResponse.json({ projects });
    } else {
      // Search projects
      const projects = await searchProjects(query);
      return NextResponse.json({ projects });
    }
  } catch (error) {
    console.error('Failed to get projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectName, description, goals, milestones, creatorUserId } = body;

    if (!projectName || !description || !creatorUserId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const projectId = `project_${Date.now()}`;

    const project: Project = {
      projectId,
      projectName,
      description,
      goals: goals || [],
      milestones: milestones || [],
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      creatorUserId,
    };

    const createdProject = await createProject(project);
    return NextResponse.json({ project: createdProject }, { status: 201 });
  } catch (error) {
    console.error('Failed to create project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

