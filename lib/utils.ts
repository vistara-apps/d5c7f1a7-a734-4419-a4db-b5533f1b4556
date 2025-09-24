import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { User, MatchScore } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateMatchScore(user1: User, user2: User): MatchScore {
  let score = 0;
  const matchReasons: string[] = [];
  const sharedGoals: string[] = [];
  const complementarySkills: string[] = [];

  // Shared goals (high weight)
  const commonGoals = user1.goals.filter(goal => user2.goals.includes(goal));
  sharedGoals.push(...commonGoals);
  score += commonGoals.length * 30;
  if (commonGoals.length > 0) {
    matchReasons.push(`${commonGoals.length} shared goal${commonGoals.length > 1 ? 's' : ''}`);
  }

  // Shared values (medium weight)
  const commonValues = user1.values.filter(value => user2.values.includes(value));
  score += commonValues.length * 20;
  if (commonValues.length > 0) {
    matchReasons.push(`${commonValues.length} shared value${commonValues.length > 1 ? 's' : ''}`);
  }

  // Complementary skills (medium weight)
  const user1UniqueSkills = user1.skills.filter(skill => !user2.skills.includes(skill));
  const user2UniqueSkills = user2.skills.filter(skill => !user1.skills.includes(skill));
  complementarySkills.push(...user1UniqueSkills, ...user2UniqueSkills);
  score += Math.min(user1UniqueSkills.length + user2UniqueSkills.length, 5) * 15;
  if (complementarySkills.length > 0) {
    matchReasons.push('Complementary skills');
  }

  // Shared skills (low weight)
  const commonSkills = user1.skills.filter(skill => user2.skills.includes(skill));
  score += commonSkills.length * 10;
  if (commonSkills.length > 0) {
    matchReasons.push(`${commonSkills.length} shared skill${commonSkills.length > 1 ? 's' : ''}`);
  }

  return {
    userId: user2.userId,
    score: Math.min(score, 100),
    matchReasons,
    sharedGoals,
    complementarySkills: complementarySkills.slice(0, 5), // Limit to top 5
  };
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
