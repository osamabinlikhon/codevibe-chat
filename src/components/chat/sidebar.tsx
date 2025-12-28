'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, MessageSquare, Settings, LogOut, ChevronLeft, ChevronRight, Code, Database, FileText, Trash2, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface ChatSession {
  id: number;
  session_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface SidebarProps {
  className?: string;
  currentSessionId?: string;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onNavigate: (feature: string) => void;
}

export function Sidebar({
  className,
  currentSessionId,
  onNewChat,
  onSelectSession,
  onNavigate,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId] = useState('default-user'); // Replace with actual user ID from auth

  const fetchSessions = useCallback(async () => {
    try {
      const response = await fetch(`/api/db-chat-history?action=sessions&userId=${userId}`);
      const data = await response.json();
      if (data.sessions) {
        setSessions(data.sessions);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this chat?')) return;

    try {
      await fetch(`/api/db-chat-history?action=session&sessionId=${sessionId}`, {
        method: 'DELETE',
      });
      setSessions((prev) => prev.filter((s) => s.session_id !== sessionId));
      if (currentSessionId === sessionId) {
        onNewChat();
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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

  return (
    <aside
      className={cn(
        'flex flex-col bg-card border-r transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Code className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold text-sm">CodeVibe Chat</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn('h-8 w-8', isCollapsed && 'mx-auto')}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <Button
          onClick={onNewChat}
          className={cn(
            'w-full gap-2',
            isCollapsed ? 'justify-center px-0' : ''
          )}
          variant="default"
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>New Chat</span>}
        </Button>
      </div>

      {/* Navigation Features */}
      {!isCollapsed && (
        <div className="px-3 py-2">
          <p className="text-xs text-muted-foreground mb-2 px-1">Features</p>
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('code-generation')}
              className="w-full justify-start gap-2"
            >
              <Code className="h-4 w-4" />
              <span>Code Generation</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('chat-history')}
              className="w-full justify-start gap-2"
            >
              <Database className="h-4 w-4" />
              <span>Chat History</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('code-snippets')}
              className="w-full justify-start gap-2"
            >
              <FileText className="h-4 w-4" />
              <span>Code Snippets</span>
            </Button>
          </div>
        </div>
      )}

      <Separator className="my-2" />

      {/* Chat History */}
      <div className="flex-1 flex flex-col min-h-0">
        {!isCollapsed && (
          <div className="px-3 py-2 flex items-center justify-between">
            <p className="text-xs text-muted-foreground px-1">Recent Chats</p>
            {sessions.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchSessions}
                className="h-6 w-6 p-0"
              >
                <FolderOpen className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
        <ScrollArea className="flex-1 px-2">
          {isLoading ? (
            <div className={cn('space-y-2', isCollapsed ? 'px-1' : 'px-2')}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    'animate-pulse bg-muted rounded-md',
                    isCollapsed ? 'h-10' : 'h-10'
                  )}
                />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className={cn('text-center py-8', isCollapsed ? 'hidden' : '')}>
              <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">No conversations yet</p>
              <p className="text-xs text-muted-foreground/70">
                Start a new chat to begin
              </p>
            </div>
          ) : (
            <div className={cn('space-y-1', isCollapsed ? 'px-1' : 'px-2')}>
              {sessions.map((session) => (
                <div
                  key={session.session_id}
                  onClick={() => onSelectSession(session.session_id)}
                  className={cn(
                    'group flex items-center gap-2 rounded-md px-2 py-2 cursor-pointer transition-colors',
                    currentSessionId === session.session_id
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted'
                  )}
                >
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  {!isCollapsed && (
                    <>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {session.title || 'Untitled Chat'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(session.updated_at)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleDeleteSession(session.session_id, e)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      <Separator className="my-2" />

      {/* Settings & Profile */}
      <div className={cn('p-2', isCollapsed ? 'space-y-1' : '')}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('settings')}
          className={cn(
            'w-full',
            isCollapsed ? 'justify-center px-0' : 'justify-start gap-2'
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'w-full text-muted-foreground hover:text-foreground',
            isCollapsed ? 'justify-center px-0' : 'justify-start gap-2'
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Log Out</span>}
        </Button>
      </div>
    </aside>
  );
}
