import { useXChat, type ChatMessage, type UseXChatOptions } from '@ant-design/x';
import { useCallback, useRef } from 'react';

// Custom hook that extends useXChat for CodeVibe Chat
export function useCodeVibeChat(options?: Partial<UseXChatOptions>) {
  // Reference to store messages externally for persistence
  const messagesRef = useRef<ChatMessage[]>([]);

  // Enhanced onSend handler that updates the ref
  const handleSend = useCallback((message: string, attachments?: FileList) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: Date.now(),
      attachments: attachments ? Array.from(attachments).map((file) => ({
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
      })) : undefined,
    };

    // Add to ref
    messagesRef.current = [...messagesRef.current, userMessage];

    return userMessage;
  }, []);

  // Get current messages from ref
  const getMessages = useCallback(() => {
    return messagesRef.current;
  }, []);

  // Clear all messages
  const clearMessages = useCallback(() => {
    messagesRef.current = [];
  }, []);

  // Base configuration for useXChat
  const xChat = useXChat({
    ...options,
    onSend: handleSend,
  });

  return {
    ...xChat,
    // Extended API
    messages: messagesRef.current,
    getMessages,
    clearMessages,
    totalMessages: messagesRef.current.length,
  };
}

// Export types for external use
export type { ChatMessage };
