export interface User {
  id: string;
  email: string;
  name: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'locked';
}

export interface Roadmap {
  steps: RoadmapStep[];
  generatedAt: string;
  industry?: string;
}

export interface StoredSession {
  sessionId: string;
  userId: string;
  isFirstTime: boolean;
  roadmap: Roadmap | null;
  messages: ChatMessage[];
}
