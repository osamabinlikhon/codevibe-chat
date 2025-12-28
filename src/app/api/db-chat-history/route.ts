import { NextRequest, NextResponse } from 'next/server';
import {
  createSession,
  getSession,
  getUserSessions,
  updateSession,
  deleteSession,
  createMessage,
  getSessionMessages,
  deleteMessage,
} from '@/lib/chat-db';

// GET /api/db-chat-history?action=sessions&userId=xxx
// GET /api/db-chat-history?action=messages&sessionId=xxx
// POST /api/db-chat-history - Create session or add message
// PUT /api/db-chat-history - Update session
// DELETE /api/db-chat-history?action=session&sessionId=xxx
// DELETE /api/db-chat-history?action=message&id=xxx

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');

    if (action === 'sessions' && userId) {
      const sessions = await getUserSessions(userId);
      return NextResponse.json({ sessions });
    }

    if (action === 'messages' && sessionId) {
      const messages = await getSessionMessages(sessionId);
      return NextResponse.json({ messages });
    }

    if (action === 'session' && sessionId) {
      const sessions = await getSession(sessionId);
      if (sessions.length === 0) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }
      return NextResponse.json({ session: sessions[0] });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, sessionId, userId, title, role, content, attachments, model } = body;

    if (action === 'createSession' && sessionId) {
      const sessions = await createSession({
        sessionId,
        userId,
        title: title || 'New Chat',
      });
      return NextResponse.json({ session: sessions[0] }, { status: 201 });
    }

    if (action === 'addMessage' && sessionId && role && content) {
      const messages = await createMessage({
        sessionId,
        role,
        content,
        attachments: attachments || null,
        model: model || null,
      });

      // Update session timestamp
      await updateSession(sessionId, {});

      return NextResponse.json({ message: messages[0] }, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid action or missing data' }, { status: 400 });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, title } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }

    const sessions = await updateSession(sessionId, { title });

    if (sessions.length === 0) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({ session: sessions[0] });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { error: 'Failed to update resource' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const sessionId = searchParams.get('sessionId');
    const messageId = searchParams.get('id');

    if (action === 'session' && sessionId) {
      await deleteSession(sessionId);
      return NextResponse.json({ success: true, message: 'Session deleted' });
    }

    if (action === 'message' && messageId) {
      const id = parseInt(messageId);
      if (isNaN(id)) {
        return NextResponse.json({ error: 'Invalid message ID' }, { status: 400 });
      }
      await deleteMessage(id);
      return NextResponse.json({ success: true, message: 'Message deleted' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    );
  }
}
