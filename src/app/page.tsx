'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bubble, Input, Button, ConfigProvider, theme, Avatar, Flex, Typography } from '@ant-design/x';
import type { BubbleProps } from '@ant-design/x';
import { SendOutlined, UserOutlined, RobotOutlined, CodeOutlined, ThunderboltOutlined } from '@ant-design/icons';

// Custom theme configuration
const customTheme = {
  token: {
    fontSize: 16,
    colorPrimary: '#52c41a',
    borderRadius: 8,
  },
  algorithm: theme.darkAlgorithm,
};

// Message type definition
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// Demo messages for initial display
const demoMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hello! I\'m CodeVibe AI. Describe what code you want to build, and I\'ll generate it for you!',
    timestamp: Date.now() - 60000,
  },
];

export default function CodeVibeChat() {
  const [messages, setMessages] = useState<Message[]>(demoMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle input submission
  const handleSubmit = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate AI response (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Here's a ${getLanguageFromQuery(userMessage.content)} example based on your request:\n\n\`\`\`${getLanguageFromQuery(userMessage.content)}\n// Your request: ${userMessage.content}\n\nfunction solution() {\n  // Implementation here\n  console.log("Hello from CodeVibe!");\n}\n\nsolution();\n\`\`\``,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Detect programming language from user query
  const getLanguageFromQuery = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('react') || lowerQuery.includes('component')) return 'tsx';
    if (lowerQuery.includes('python')) return 'python';
    if (lowerQuery.includes('javascript') || lowerQuery.includes('js')) return 'javascript';
    if (lowerQuery.includes('css')) return 'css';
    if (lowerQuery.includes('html')) return 'html';
    return 'typescript';
  };

  // Handle key press (Enter to submit)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Custom user bubble configuration
  const userBubbleProps: BubbleProps = {
    placement: 'end',
    styles: {
      content: {
        background: '#52c41a',
        color: '#fff',
      },
    },
  };

  // Custom assistant bubble configuration
  const assistantBubbleProps: BubbleProps = {
    placement: 'start',
    avatar: <Avatar icon={<RobotOutlined />} style={{ background: '#1677ff' }} />,
    styles: {
      content: {
        background: '#1f1f1f',
        color: '#fff',
      },
    },
  };

  return (
    <ConfigProvider theme={customTheme}>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#141414' }}>
        {/* Header */}
        <div style={{ 
          padding: '16px 24px', 
          borderBottom: '1px solid #303030',
          background: '#141414',
        }}>
          <Flex align="center" gap={12}>
            <Avatar size={40} icon={<CodeOutlined />} style={{ background: '#52c41a' }} />
            <div>
              <Typography.Title level={4} style={{ margin: 0, color: '#fff' }}>
                CodeVibe Chat
              </Typography.Title>
              <Typography.Text type="secondary" style={{ fontSize: 12, color: '#888' }}>
                AI-Powered Code Generation
              </Typography.Text>
            </div>
          </Flex>
        </div>

        {/* Messages Area */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          <Flex vertical gap={16}>
            {messages.map((message) => (
              <Bubble
                key={message.id}
                content={message.content}
                {...(message.role === 'user' ? userBubbleProps : assistantBubbleProps)}
              >
                <Flex 
                  gap={8} 
                  align="end"
                  justify={message.role === 'user' ? 'flex-end' : 'flex-start'}
                >
                  {message.role === 'assistant' && (
                    <Avatar size={32} icon={<RobotOutlined />} style={{ background: '#1677ff' }} />
                  )}
                  <div />
                  {message.role === 'user' && (
                    <Avatar size={32} icon={<UserOutlined />} style={{ background: '#52c41a' }} />
                  )}
                </Flex>
              </Bubble>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <Bubble
                placement="start"
                content={
                  <Flex align="center" gap={8}>
                    <ThunderboltOutlined spin /> Generating code...
                  </Flex>
                }
                avatar={<Avatar size={32} icon={<RobotOutlined />} style={{ background: '#1677ff' }} />}
                styles={{
                  content: {
                    background: '#1f1f1f',
                    color: '#fff',
                  },
                }}
              >
                <div />
              </Bubble>
            )}
            
            <div ref={messagesEndRef} />
          </Flex>
        </div>

        {/* Input Area */}
        <div style={{ 
          padding: '16px 24px', 
          borderTop: '1px solid #303030',
          background: '#141414',
        }}>
          <Input.TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe the code you want to build... (e.g., 'Create a React button component')"
            autoSize={{ minRows: 1, maxRows: 4 }}
            style={{ 
              resize: 'none',
              background: '#1f1f1f',
              border: '1px solid #303030',
              color: '#fff',
              padding: '12px 16px',
              borderRadius: 8,
            }}
          />
          <Flex justify="flex-end" style={{ marginTop: 12 }}>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSubmit}
              disabled={!inputValue.trim() || isLoading}
              style={{ 
                background: '#52c41a',
                borderColor: '#52c41a',
                borderRadius: 8,
                height: 40,
              }}
            >
              Generate Code
            </Button>
          </Flex>
        </div>
      </div>
    </ConfigProvider>
  );
}
