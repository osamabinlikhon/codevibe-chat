import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Session type definition
export interface ChatSession {
  id: string;
  sessionId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  userId: string;
}

// Session state interface
interface SessionState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  userId: string;
  isLoading: boolean;
  
  // Actions
  setSessions: (sessions: ChatSession[]) => void;
  addSession: (session: ChatSession) => void;
  updateSession: (sessionId: string, updates: Partial<ChatSession>) => void;
  deleteSession: (sessionId: string) => void;
  setActiveSession: (sessionId: string | null) => void;
  setUserId: (userId: string) => void;
  setLoading: (loading: boolean) => void;
  reorderSessions: (sessions: ChatSession[]) => void;
}

// Create session store with persistence
export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      // Initial state
      sessions: [],
      activeSessionId: null,
      userId: 'default-user',
      isLoading: false,

      // Actions
      setSessions: (sessions) =>
        set({ sessions }),

      addSession: (session) =>
        set((state) => ({
          sessions: [session, ...state.sessions],
          activeSessionId: session.sessionId,
        })),

      updateSession: (sessionId, updates) =>
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.sessionId === sessionId
              ? { ...session, ...updates, updatedAt: new Date().toISOString() }
              : session
          ),
        })),

      deleteSession: (sessionId) =>
        set((state) => ({
          sessions: state.sessions.filter((session) => session.sessionId !== sessionId),
          activeSessionId: state.activeSessionId === sessionId ? null : state.activeSessionId,
        })),

      setActiveSession: (sessionId) =>
        set({ activeSessionId: sessionId }),

      setUserId: (userId) =>
        set({ userId }),

      setLoading: (isLoading) =>
        set({ isLoading }),

      reorderSessions: (sessions) =>
        set({ sessions }),
    }),
    {
      name: 'codevibe-sessions',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Helper function to create a new session
export const createNewSession = (userId: string): ChatSession => {
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id: Date.now().toString(),
    sessionId,
    title: 'New Chat',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messageCount: 0,
    userId,
  };
};
