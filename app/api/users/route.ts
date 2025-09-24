import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUser, searchUsers } from '@/lib/db';
import { User } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const userId = searchParams.get('id');

    if (userId) {
      // Get specific user
      const user = await getUser(userId);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json({ user });
    } else {
      // Search users
      const users = await searchUsers(query);
      return NextResponse.json({ users });
    }
  } catch (error) {
    console.error('Failed to get users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { farcasterId, displayName, bio, skills, values, goals, ethAddress } = body;

    if (!displayName || !bio) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userId = farcasterId ? farcasterId.toString() : `user_${Date.now()}`;

    const user: User = {
      userId,
      farcasterId: farcasterId ? farcasterId.toString() : undefined,
      displayName,
      bio,
      skills: skills || [],
      values: values || [],
      goals: goals || [],
      ethAddress,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdUser = await createUser(user);
    return NextResponse.json({ user: createdUser }, { status: 201 });
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

