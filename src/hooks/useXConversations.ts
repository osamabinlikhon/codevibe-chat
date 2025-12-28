import { useXConversations, type Conversation, type UseXConversationsOptions } from '@ant-design/x';
import { useCallback, useRef } from 'react';

// Extended conversation interface with additional metadata
export interface CodeVibeConversation extends Conversation {
  title: string;
  description?: string;
  model?: string;
  messageCount: number;
  lastMessage?: string;
  tags?: string[];
  isPinned?: boolean;
  isFavorite?: boolean;
}

// Custom hook that extends useXConversations for CodeVibe Chat
export function useCodeVibeConversations(options?: Partial<UseXConversationsOptions>) {
  // Reference to store conversations externally for persistence
  const conversationsRef = useRef<CodeVibeConversation[]>([]);

  // Create a new conversation
  const createConversation = useCallback((title?: string): CodeVibeConversation => {
    const id = `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newConversation: CodeVibeConversation = {
      id,
      title: title || 'New Chat',
      messageCount: 0,
      isPinned: false,
      isFavorite: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Add to ref
    conversationsRef.current = [newConversation, ...conversationsRef.current];

    return newConversation;
  }, []);

  // Update conversation metadata
  const updateConversation = useCallback((id: string, updates: Partial<CodeVibeConversation>) => {
    conversationsRef.current = conversationsRef.current.map((conv) =>
      conv.id === id
        ? { ...conv, ...updates, updatedAt: Date.now() }
        : conv
    );
  }, []);

  // Delete a conversation
  const deleteConversation = useCallback((id: string) => {
    conversationsRef.current = conversationsRef.current.filter((conv) => conv.id !== id);
  }, []);

  // Pin/unpin conversation
  const togglePin = useCallback((id: string) => {
    conversationsRef.current = conversationsRef.current.map((conv) =>
      conv.id === id ? { ...conv, isPinned: !conv.isPinned, updatedAt: Date.now() } : conv
    );
  }, []);

  // Add to favorites
  const toggleFavorite = useCallback((id: string) => {
    conversationsRef.current = conversationsRef.current.map((conv) =>
      conv.id === id ? { ...conv, isFavorite: !conv.isFavorite, updatedAt: Date.now() } : conv
    );
  }, []);

  // Get conversations sorted by pinned status and date
  const getSortedConversations = useCallback(() => {
    return [...conversationsRef.current].sort((a, b) => {
      // Pinned conversations first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // Then by updated date (newest first)
      return (b.updatedAt || 0) - (a.updatedAt || 0);
    });
  }, []);

  // Search conversations
  const searchConversations = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return conversationsRef.current.filter(
      (conv) =>
        conv.title.toLowerCase().includes(lowerQuery) ||
        conv.description?.toLowerCase().includes(lowerQuery) ||
        conv.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }, []);

  // Get conversation by ID
  const getConversation = useCallback((id: string) => {
    return conversationsRef.current.find((conv) => conv.id === id);
  }, []);

  // Base configuration for useXConversations
  const xConversations = useXConversations({
    ...options,
  });

  return {
    ...xConversations,
    // Extended API
    conversations: conversationsRef.current,
    sortedConversations: getSortedConversations(),
    createConversation,
    updateConversation,
    deleteConversation,
    togglePin,
    toggleFavorite,
    searchConversations,
    getConversation,
    totalConversations: conversationsRef.current.length,
  };
}

// Export types
export type { Conversation };
