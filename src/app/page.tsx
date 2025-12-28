'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Bubble,
  Input,
  Button,
  ConfigProvider,
  theme,
  Avatar,
  Flex,
  Typography,
  type BubbleProps,
} from '@ant-design/x';
import {
  SendOutlined,
  UserOutlined,
  RobotOutlined,
  CodeOutlined,
  ThunderboltOutlined,
  PlusOutlined,
  MessageOutlined,
  DeleteOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useStreamingChat } from '@/lib/streaming-chat';

// Custom theme configuration
const customTheme = {
  token: {
    fontSize: 16,
    colorPrimary: '#52c41a',
    borderRadius: 8,
  },
  algorithm: theme.darkAlgorithm,
};

// Conversation type
interface Conversation {
  id: string;
  title: string;
  messageCount: number;
  createdAt: number;
  isActive?: boolean;
}

// Initial demo conversation
const initialConversation: Conversation = {
  id: 'default',
  title: 'Welcome Chat',
  messageCount: 1,
  createdAt: Date.now(),
};

export default function CodeVibeChat() {
  // Conversations state
  const [conversations, setConversations] = useState<Conversation[]>([initialConversation]);
  const [activeConversationId, setActiveConversationId] = useState<string>('default');

  // Streaming chat hook
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    cancelRequest,
  } = useStreamingChat('/api/chat');

  // Input state
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Create a new conversation
  const handleCreateConversation = useCallback(() => {
    const newId = `conv-${Date.now()}`;
    const newConversation: Conversation = {
      id: newId,
      title: 'New Chat',
      messageCount: 0,
      createdAt: Date.now(),
    };

    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newId);
    clearMessages();
    setInputValue('');
  }, [clearMessages]);

  // Delete a conversation
  const handleDeleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((conv) => conv.id !== id));
      if (activeConversationId === id) {
        const remaining = conversations.filter((conv) => conv.id !== id);
        setActiveConversationId(remaining[0]?.id || 'default');
        clearMessages();
      }
    },
    [activeConversationId, conversations, clearMessages]
  );

  // Handle message submission with streaming
  const handleSubmit = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;

    // Update conversation title if it's a new chat
    const currentConv = conversations.find((c) => c.id === activeConversationId);
    if (currentConv && currentConv.title === 'New Chat') {
      const preview = inputValue.slice(0, 30) + (inputValue.length > 30 ? '...' : '');
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConversationId
            ? { ...conv, title: preview, messageCount: conv.messageCount + 2 }
            : conv
        )
      );
    }

    // Send message with streaming
    await sendMessage(inputValue.trim(), activeConversationId);
    setInputValue('');
  }, [inputValue, isLoading, sendMessage, activeConversationId, conversations]);

  // Handle key press (Enter to submit, Shift+Enter for new line)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Cancel ongoing request
  const handleCancel = useCallback(() => {
    cancelRequest();
  }, [cancelRequest]);

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

  // Get active conversation title
  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  return (
    <ConfigProvider theme={customTheme}>
      <div
        style={{
          height: '100vh',
          display: 'flex',
          background: '#141414',
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            width: 260,
            borderRight: '1px solid #303030',
            background: '#1a1a1a',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Sidebar Header */}
          <div style={{ padding: '16px', borderBottom: '1px solid #303030' }}>
            <Flex align="center" gap={12}>
              <Avatar
                size={40}
                icon={<CodeOutlined />}
                style={{ background: '#52c41a' }}
              />
              <div>
                <Typography.Title level={5} style={{ margin: 0, color: '#fff' }}>
                  CodeVibe Chat
                </Typography.Title>
                <Typography.Text
                  type="secondary"
                  style={{ fontSize: 12, color: '#888' }}
                >
                  {conversations.length} conversations
                </Typography.Text>
              </div>
            </Flex>
          </div>

          {/* New Chat Button */}
          <div style={{ padding: '12px 16px' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateConversation}
              block
              style={{ background: '#52c41a', borderColor: '#52c41a' }}
            >
              New Chat
            </Button>
          </div>

          {/* Conversations List */}
          <div style={{ flex: 1, overflow: 'auto', padding: '0 8px' }}>
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => {
                  setActiveConversationId(conv.id);
                  clearMessages();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 12px',
                  marginBottom: '4px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background:
                    activeConversationId === conv.id
                      ? 'rgba(82, 196, 26, 0.15)'
                      : 'transparent',
                  border: `1px solid ${
                    activeConversationId === conv.id ? '#52c41a' : 'transparent'
                  }`,
                  transition: 'all 0.2s',
                }}
              >
                <MessageOutlined
                  style={{
                    color:
                      activeConversationId === conv.id ? '#52c41a' : '#888',
                    marginRight: 12,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Typography.Text
                    ellipsis
                    style={{
                      color: activeConversationId === conv.id ? '#52c41a' : '#fff',
                      fontWeight: activeConversationId === conv.id ? 500 : 400,
                    }}
                  >
                    {conv.title}
                  </Typography.Text>
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: 11, display: 'block' }}
                  >
                    {conv.messageCount} messages
                  </Typography.Text>
                </div>
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConversation(conv.id);
                  }}
                  style={{ color: '#888' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div
            style={{
              padding: '16px 24px',
              borderBottom: '1px solid #303030',
              background: '#141414',
            }}
          >
            <Flex align="center" gap={12}>
              <Avatar
                size={40}
                icon={<CodeOutlined />}
                style={{ background: '#52c41a' }}
              />
              <div>
                <Typography.Title level={4} style={{ margin: 0, color: '#fff' }}>
                  {activeConversation?.title || 'CodeVibe Chat'}
                </Typography.Title>
                <Typography.Text
                  type="secondary"
                  style={{ fontSize: 12, color: '#888' }}
                >
                  AI-Powered Code Generation
                </Typography.Text>
              </div>
            </Flex>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
            <Flex vertical gap={16}>
              {/* Welcome message if no messages */}
              {messages.length === 0 && (
                <Bubble
                  placement="start"
                  content={
                    <div>
                      <p style={{ margin: 0, marginBottom: 8 }}>
                        Hello! I'm <strong>CodeVibe AI</strong>. I can help you:
                      </p>
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        <li>Generate React components</li>
                        <li>Write Python scripts</li>
                        <li>Build API endpoints</li>
                        <li>Debug code issues</li>
                      </ul>
                      <p style={{ margin: '8px 0 0 0' }}>
                        Describe what you want to build, and I'll generate it for you!
                      </p>
                    </div>
                  }
                  avatar={
                    <Avatar
                      size={32}
                      icon={<RobotOutlined />}
                      style={{ background: '#1677ff' }}
                    />
                  }
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

              {/* Chat messages */}
              {messages.map((message) => (
                <Bubble
                  key={message.id}
                  content={message.content}
                  loading={message.streaming}
                  {...(message.role === 'user' ? userBubbleProps : assistantBubbleProps)}
                >
                  <Flex
                    gap={8}
                    align="end"
                    justify={message.role === 'user' ? 'flex-end' : 'flex-start'}
                  >
                    {message.role === 'assistant' && (
                      <Avatar
                        size={32}
                        icon={<RobotOutlined />}
                        style={{ background: '#1677ff' }}
                      />
                    )}
                    <div />
                    {message.role === 'user' && (
                      <Avatar
                        size={32}
                        icon={<UserOutlined />}
                        style={{ background: '#52c41a' }}
                      />
                    )}
                  </Flex>
                </Bubble>
              ))}

              {/* Error message */}
              {error && (
                <Bubble
                  placement="start"
                  content={`Error: ${error}`}
                  avatar={
                    <Avatar
                      size={32}
                      icon={<RobotOutlined />}
                      style={{ background: '#ff4d4f' }}
                    />
                  }
                  styles={{
                    content: {
                      background: '#1f1f1f',
                      color: '#ff4d4f',
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
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid #303030',
              background: '#141414',
            }}
          >
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
            <Flex justify="flex-end" gap={12} style={{ marginTop: 12 }}>
              {/* Cancel button (show when loading) */}
              {isLoading && (
                <Button
                  icon={<StopOutlined />}
                  onClick={handleCancel}
                  style={{ borderColor: '#ff4d4f', color: '#ff4d4f' }}
                >
                  Cancel
                </Button>
              )}

              {/* Send button */}
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
                {isLoading ? 'Generating...' : 'Generate Code'}
              </Button>
            </Flex>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
