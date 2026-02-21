import { v4 as uuidv4 } from 'uuid';
import type { StoredSession, Roadmap, ChatMessage } from './types';

const SESSION_KEY = (userId: string) => `opticontrol_session_${userId}`;

export function getStoredSession(userId: string): StoredSession {
  if (typeof window === 'undefined') {
    return {
      sessionId: uuidv4(),
      userId,
      isFirstTime: true,
      roadmap: null,
      messages: [],
    };
  }
  const raw = localStorage.getItem(SESSION_KEY(userId));
  if (!raw) {
    return {
      sessionId: uuidv4(),
      userId,
      isFirstTime: true,
      roadmap: null,
      messages: [],
    };
  }
  return JSON.parse(raw) as StoredSession;
}

export function saveStoredSession(session: StoredSession): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY(session.userId), JSON.stringify(session));
}

export function parseRoadmapFromResponse(text: string): Roadmap | null {
  const match = text.match(/```json_roadmap\s*([\s\S]*?)```/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[1].trim());
    return {
      ...parsed,
      generatedAt: new Date().toISOString(),
    } as Roadmap;
  } catch {
    return null;
  }
}

export function stripRoadmapJson(text: string): string {
  return text.replace(/```json_roadmap[\s\S]*?```/g, '').trim();
}
