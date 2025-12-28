import React, { useState, useCallback, useRef } from 'react';
import {
  XRequest,
  XStream,
  XRequestOptions,
} from '@ant-design/x-sdk';

// Types for streaming chat
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  streaming?: boolean;
}

export interface ChatInput {
  prompt: string;
  sessionId?: string;
}

// Hook for streaming chat functionality
export function useStreamingChat(apiEndpoint: string = '/api/chat') {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Send message and stream response
  const sendMessage = useCallback(
    async (prompt: string, sessionId?: string) => {
      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);

      // Add user message
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: prompt,
        timestamp: Date.now(),
      };

      // Create placeholder assistant message
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        streaming: true,
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);

      try {
        // Create XRequest configuration
        const requestConfig: XRequestOptions<ChatInput> = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            prompt,
            sessionId,
          },
        };

        // Make the request
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Check if response is streaming
        const contentType = response.headers.get('content-type');
        const isStreaming = contentType?.includes('text/event-stream') || !contentType;

        if (isStreaming && response.body) {
          // Handle streaming response with XStream
          let accumulatedContent = '';
          
          for await (const chunk of XStream({
            readableStream: response.body,
            parser: (data) => {
              // Parse SSE format if needed
              if (typeof data === 'string') {
                const lines = data.split('\n');
                for (const line of lines) {
                  if (line.startsWith('data: ')) {
                    const jsonStr = line.slice(6);
                    if (jsonStr === '[DONE]') {
                      return null; // End of stream
                    }
                    try {
                      const parsed = JSON.parse(jsonStr);
                      return parsed.text || parsed.content || parsed;
                    } catch {
                      return data;
                    }
                  }
                }
              }
              return data;
            },
          })) {
            if (chunk && typeof chunk === 'string') {
              accumulatedContent += chunk;
              
              // Update the assistant message with accumulated content
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessage.id
                    ? { ...msg, content: accumulatedContent }
                    : msg
                )
              );
            }
          }

          // Mark streaming as complete
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? { ...msg, streaming: false }
                : msg
            )
          );
        } else {
          // Handle non-streaming response
          const data = await response.json();
          const aiContent = data.code || data.content || data.text || JSON.stringify(data);

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? { ...msg, content: aiContent, streaming: false }
                : msg
            )
          );
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Request was cancelled
          return;
        }

        console.error('Chat error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');

        // Remove the assistant message on error
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== assistantMessage.id)
        );

        // Add error message
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [apiEndpoint]
  );

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  // Remove a specific message
  const removeMessage = useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  }, []);

  // Cancel current request
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    removeMessage,
    cancelRequest,
    totalMessages: messages.length,
  };
}
