import React from 'react';
import {
  DefaultChatProvider,
  XRequest,
  XRequestOptions,
} from '@ant-design/x-sdk';

// Chat input/output types
export interface ChatInput {
  query: string;
  sessionId?: string;
}

export interface ChatOutput {
  text: string;
  code?: string;
  language?: string;
}

// Create a chat provider instance for Groq API
export function createChatProvider() {
  return React.useMemo(
    () =>
      new DefaultChatProvider<ChatOutput, ChatInput, string>({
        request: new XRequest<string, ChatInput>('/api/chat', {
          method: 'POST',
          manual: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }),
        parseResponse: (responseText) => {
          try {
            const data = JSON.parse(responseText);
            return {
              text: data.code || responseText,
              code: data.code,
              language: data.language,
            };
          } catch {
            return {
              text: responseText,
            };
          }
        },
        generateParams: (input) => {
          return {
            query: input.query,
            sessionId: input.sessionId,
          };
        },
        processStreamChunk: (chunk) => {
          // Handle streaming response if needed
          return chunk;
        },
      }),
    []
  );
}

// Hook to create and use chat provider
export function useChatProvider() {
  const [provider] = React.useState(() =>
    new DefaultChatProvider<ChatOutput, ChatInput, string>({
      request: new XRequest<string, ChatInput>('/api/chat', {
        method: 'POST',
        manual: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      parseResponse: (responseText) => {
        try {
          const data = JSON.parse(responseText);
          return {
            text: data.code || responseText,
            code: data.code,
            language: data.language,
          };
        } catch {
          return {
            text: responseText,
          };
        }
      },
      generateParams: (input) => ({
        query: input.query,
        sessionId: input.sessionId,
      }),
    })
  );

  return provider;
}
