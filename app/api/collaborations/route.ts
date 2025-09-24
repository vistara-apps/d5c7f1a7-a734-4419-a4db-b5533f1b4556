import { NextRequest, NextResponse } from 'next/server';
import { createCollaboration, getCollaborationsByUser, getCollaborationsByProject } from '@/lib/db';
import { Collaboration } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const projectId = searchParams.get('projectId');

    if (userId) {
      // Get collaborations by user
      const collaborations = await getCollaborationsByUser(userId);
      return NextResponse.json({ collaborations });
    } else if (projectId) {
      // Get collaborations by project
      const collaborations = await getCollaborationsByProject(projectId);
      return NextResponse.json({ collaborations });
    } else {
      return NextResponse.json({ error: 'Missing userId or projectId parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('Failed to get collaborations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, userId, role, contributionSummary } = body;

    if (!userId || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const collaborationId = `collab_${Date.now()}`;

    const collaboration: Collaboration = {
      collaborationId,
      projectId,
      userId,
      role,
      contributionSummary: contributionSummary || '',
      mutualBenefitScore: 0, // Will be calculated later
      joinedAt: new Date(),
    };

    const createdCollaboration = await createCollaboration(collaboration);
    return NextResponse.json({ collaboration: createdCollaboration }, { status: 201 });
  } catch (error) {
    console.error('Failed to create collaboration:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

