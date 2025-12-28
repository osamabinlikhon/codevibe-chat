'use client';

import React, { useState, useCallback } from 'react';
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Badge,
  Button,
  Input,
  Tooltip,
  Typography,
  Flex,
  Space,
  Divider,
  Modal,
  Form,
  Select,
  Switch,
  Slider,
  Drawer,
  useTheme,
} from 'antd';
import {
  HomeOutlined,
  CodeOutlined,
  MessageOutlined,
  SettingOutlined,
  UserOutlined,
  SearchOutlined,
  PlusOutlined,
  FolderOutlined,
  StarOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  AppstoreOutlined,
  CloudOutlined,
  FileTextOutlined,
  HistoryOutlined,
  BellOutlined,
  LogoutOutlined,
  MoonOutlined,
  SunOutlined,
  LanguageOutlined,
  FullscreenOutlined,
  QuestionCircleOutlined,
  SyncOutlined,
  StarFilled,
  CommentOutlined,
} from '@ant-design/icons';
import type { MenuProps, MenuTheme } from 'antd';
import type { DropdownProps } from 'antd/es/dropdown';

const { Sider } = Layout;
const { Text, Title } = Typography;

// ============================================
// Type Definitions
// ============================================

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: Date;
  messageCount: number;
  isPinned?: boolean;
  isFavorite?: boolean;
}

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  onNewChat?: () => void;
  onSelectChat?: (sessionId: string) => void;
  onNavigate?: (key: string) => void;
  currentChatId?: string;
  sessions?: ChatSession[];
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
}

// ============================================
// Sidebar Component
// ============================================

export function Sidebar({
  collapsed = false,
  onCollapse,
  onNewChat,
  onSelectChat,
  onNavigate,
  currentChatId,
  sessions = [],
  user = { name: 'CodeVibe User', email: 'user@codevibe.chat' },
}: SidebarProps) {
  const theme = useTheme();
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['home']);
  const [searchValue, setSearchValue] = useState('');

  // Handle menu item click
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setSelectedKeys(e.key === 'new-chat' ? [] : [e.key]);
    
    if (e.key === 'new-chat') {
      onNewChat?.();
    } else if (e.key === 'home' || e.key === 'code' || e.key === 'settings') {
      onNavigate?.(e.key);
    }
  };

  // Filter sessions based on search
  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Pinned sessions first, then recent
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  // User menu items
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Log Out',
      danger: true,
    },
  ];

  // Main navigation items
  const mainNavItems: MenuProps['items'] = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Home',
    },
    {
      key: 'code',
      icon: <CodeOutlined />,
      label: 'Code Generator',
    },
    {
      key: 'chat',
      icon: <MessageOutlined />,
      label: 'Chat History',
    },
    {
      key: 'templates',
      icon: <FileTextOutlined />,
      label: 'Templates',
    },
  ];

  // Tools navigation items
  const toolsNavItems: MenuProps['items'] = [
    {
      key: 'sandbox',
      icon: <CodeOutlined />,
      label: 'Code Sandbox',
    },
    {
      key: 'storage',
      icon: <CloudOutlined />,
      label: 'Cloud Storage',
    },
    {
      key: 'analytics',
      icon: <AppstoreOutlined />,
      label: 'Analytics',
    },
  ];

  // Format date for display
  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Session context menu
  const getSessionMenuItems = (session: ChatSession): MenuProps['items'] => [
    {
      key: 'pin',
      icon: session.isPinned ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />,
      label: session.isPinned ? 'Unpin' : 'Pin to top',
    },
    {
      key: 'rename',
      icon: <EditOutlined />,
      label: 'Rename',
    },
    {
      key: 'duplicate',
      icon: <CopyOutlined />,
      label: 'Duplicate',
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Delete',
      danger: true,
    },
  ];

  return (
    <Sider
      width={280}
      collapsedWidth={80}
      collapsed={collapsed}
      onCollapse={onCollapse}
      theme={theme === 'dark' ? 'dark' : 'light'}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        borderRight: '1px solid #303030',
        background: theme === 'dark' ? '#141414' : '#fff',
      }}
    >
      {/* Logo Area */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0' : '0 16px',
          borderBottom: '1px solid #303030',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Avatar
            size={collapsed ? 36 : 40}
            style={{
              background: '#52c41a',
              cursor: 'pointer',
            }}
            icon={<CodeOutlined />}
          />
          {!collapsed && (
            <Title level={5} style={{ margin: 0, color: '#fff' }}>
              CodeVibe
            </Title>
          )}
        </div>
      </div>

      {/* New Chat Button */}
      <div style={{ padding: collapsed ? '12px 8px' : '16px' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          block
          onClick={onNewChat}
          style={{
            background: '#52c41a',
            borderColor: '#52c41a',
            borderRadius: 8,
            height: 44,
          }}
        >
          {!collapsed && 'New Chat'}
        </Button>
      </div>

      {/* Search */}
      {!collapsed && (
        <div style={{ padding: '0 16px 16px' }}>
          <Input
            placeholder="Search conversations..."
            prefix={<SearchOutlined style={{ color: '#888' }} />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            allowClear
            style={{
              borderRadius: 8,
              background: '#1f1f1f',
              border: '1px solid #303030',
            }}
          />
        </div>
      )}

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Main Navigation */}
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          onClick={handleMenuClick}
          items={mainNavItems}
          theme={theme === 'dark' ? 'dark' : 'light'}
          style={{
            border: 'none',
            background: 'transparent',
          }}
          inlineIndent={16}
        />

        <Divider style={{ margin: '12px 0', borderColor: '#303030' }} />

        {/* Recent Chats Section */}
        {!collapsed && (
          <div style={{ padding: '0 16px 8px' }}>
            <Flex justify="space-between" align="center">
              <Text
                type="secondary"
                style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}
              >
                Recent Chats
              </Text>
              <Badge count={sortedSessions.length} size="small" />
            </Flex>
          </div>
        )}

        {/* Chat Sessions List */}
        {sortedSessions.length > 0 ? (
          <Menu
            mode="inline"
            selectedKeys={currentChatId ? [currentChatId] : []}
            onClick={({ key }) => onSelectChat?.(key)}
            items={sortedSessions.map((session) => ({
              key: session.id,
              icon: session.isPinned ? (
                <StarFilled style={{ color: '#faad14', fontSize: 12 }} />
              ) : (
                <MessageOutlined style={{ fontSize: 12 }} />
              ),
              label: (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {session.title}
                  </span>
                </div>
              ),
            }))}
            theme={theme === 'dark' ? 'dark' : 'light'}
            style={{
              border: 'none',
              background: 'transparent',
            }}
          />
        ) : (
          !collapsed && (
            <div style={{ padding: '24px 16px', textAlign: 'center' }}>
              <MessageOutlined style={{ fontSize: 32, color: '#888', marginBottom: 8 }} />
              <Text type="secondary" style={{ display: 'block' }}>
                No conversations yet
              </Text>
              <Text
                type="secondary"
                style={{ fontSize: 12, display: 'block', marginTop: 4 }}
              >
                Start a new chat to begin
              </Text>
            </div>
          )
        )}

        <Divider style={{ margin: '12px 0', borderColor: '#303030' }} />

        {/* Tools Navigation */}
        {!collapsed && (
          <div style={{ padding: '0 16px 8px' }}>
            <Text
              type="secondary"
              style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}
            >
              Tools
            </Text>
          </div>
        )}
        <Menu
          mode="inline"
          onClick={({ key }) => onNavigate?.(key)}
          items={toolsNavItems}
          theme={theme === 'dark' ? 'dark' : 'light'}
          style={{
            border: 'none',
            background: 'transparent',
          }}
        />
      </div>

      {/* Bottom Section */}
      <div
        style={{
          borderTop: '1px solid #303030',
          padding: collapsed ? '12px 8px' : '16px',
        }}
      >
        {/* Settings */}
        <Menu
          mode="inline"
          onClick={({ key }) => onNavigate?.(key)}
          items={[
            {
              key: 'settings',
              icon: <SettingOutlined />,
              label: !collapsed && 'Settings',
            },
            {
              key: 'help',
              icon: <QuestionCircleOutlined />,
              label: !collapsed && 'Help & Support',
            },
          ]}
          theme={theme === 'dark' ? 'dark' : 'light'}
          style={{
            border: 'none',
            background: 'transparent',
          }}
        />

        {/* User Profile */}
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="topCenter"
          trigger={['click']}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: collapsed ? '8px' : '12px',
              marginTop: collapsed ? '0' : '8px',
              borderRadius: 8,
              cursor: 'pointer',
              background: '#1f1f1f',
              border: '1px solid #303030',
              justifyContent: collapsed ? 'center' : 'flex-start',
            }}
          >
            <Avatar
              size={collapsed ? 32 : 36}
              style={{ background: '#52c41a' }}
              icon={<UserOutlined />}
            />
            {!collapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <Text
                  ellipsis
                  style={{
                    display: 'block',
                    color: '#fff',
                    fontWeight: 500,
                  }}
                >
                  {user.name}
                </Text>
                <Text
                  ellipsis
                  type="secondary"
                  style={{ fontSize: 12 }}
                >
                  {user.email}
                </Text>
              </div>
            )}
          </div>
        </Dropdown>
      </div>
    </Sider>
  );
}

// ============================================
// Settings Modal Component
// ============================================

export function SettingsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Settings"
      open={open}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          theme: 'dark',
          language: 'en',
          fontSize: 14,
          streaming: true,
          notifications: true,
        }}
      >
        {/* Appearance */}
        <Form.Item
          name="theme"
          label="Theme"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { value: 'dark', label: 'Dark Mode' },
              { value: 'light', label: 'Light Mode' },
              { value: 'system', label: 'System Default' },
            ]}
          />
        </Form.Item>

        {/* Language */}
        <Form.Item
          name="language"
          label="Language"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { value: 'en', label: 'English' },
              { value: 'zh', label: '中文' },
              { value: 'bn', label: 'বাংলা' },
              { value: 'es', label: 'Español' },
            ]}
          />
        </Form.Item>

        {/* Font Size */}
        <Form.Item name="fontSize" label="Font Size">
          <Slider
            min={12}
            max={20}
            marks={{
              12: '12px',
              14: '14px',
              16: '16px',
              18: '18px',
              20: '20px',
            }}
          />
        </Form.Item>

        {/* Toggles */}
        <Form.Item name="streaming" valuePropName="checked">
          <Flex justify="space-between" align="center">
            <Text>Streaming Responses</Text>
            <Switch />
          </Flex>
        </Form.Item>

        <Form.Item name="notifications" valuePropName="checked">
          <Flex justify="space-between" align="center">
            <Text>Desktop Notifications</Text>
            <Switch />
          </Flex>
        </Form.Item>

        {/* Actions */}
        <Flex gap="small" justify="flex-end" style={{ marginTop: 24 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
}

// ============================================
// Mobile Drawer Sidebar
// ============================================

export function MobileSidebar({
  open,
  onClose,
  ...props
}: SidebarProps & { open: boolean; onClose: () => void }) {
  return (
    <Drawer
      placement="left"
      open={open}
      onClose={onClose}
      width={280}
      styles={{
        body: { padding: 0, background: '#141414' },
      }}
    >
      <Sidebar {...props} onCollapse={onClose} />
    </Drawer>
  );
}

// Export types
export type { ChatSession, SidebarProps };
