import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Message type definition
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  attachments?: Array<{
    url: string;
    name: string;
    type: string;
  }>;
}

// Chat state interface
interface ChatState {
  messages: Message[];
  currentSessionId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSessionId: (sessionId: string | null) => void;
  removeMessage: (messageId: string) => void;
  updateMessage: (messageId: string, content: string) => void;
}

// Create chat store with persistence
export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      // Initial state
      messages: [],
      currentSessionId: null,
      isLoading: false,
      error: null,

      // Actions
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),

      setMessages: (messages) =>
        set({ messages }),

      clearMessages: () =>
        set({ messages: [], currentSessionId: null, error: null }),

      setLoading: (isLoading) =>
        set({ isLoading }),

      setError: (error) =>
        set({ error }),

      setSessionId: (sessionId) =>
        set({ currentSessionId: sessionId }),

      removeMessage: (messageId) =>
        set((state) => ({
          messages: state.messages.filter((msg) => msg.id !== messageId),
        })),

      updateMessage: (messageId, content) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === messageId ? { ...msg, content } : msg
          ),
        })),
    }),
    {
      name: 'codevibe-chat',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        messages: state.messages.slice(-50), // Keep only last 50 messages
        currentSessionId: state.currentSessionId,
      }),
    }
  )
);
