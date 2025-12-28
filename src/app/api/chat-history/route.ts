import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// Initialize Redis client from environment variables
const redis = Redis.fromEnv();

// Helper to get session prefix for chat history
const getSessionKey = (sessionId: string, messageId?: string) => {
  const base = `chat:${sessionId}`;
  return messageId ? `${base}:${messageId}` : base;
};

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      );
    }

    // Get all messages for the session
    const messages = await redis.lrange(getSessionKey(sessionId), 0, -1);

    return NextResponse.json(
      { messages: messages || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Redis GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
};

export const POST = async (req: Request) => {
  try {
    const { sessionId, message } = await req.json();

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: 'sessionId and message are required' },
        { status: 400 }
      );
    }

    // Store message in Redis list with timestamp
    const messageWithMeta = {
      ...message,
      timestamp: Date.now(),
    };

    await redis.rpush(getSessionKey(sessionId), JSON.stringify(messageWithMeta));

    return NextResponse.json(
      { success: true, message: 'Message stored' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Redis POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to store message' },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      );
    }

    // Delete the entire chat session
    await redis.del(getSessionKey(sessionId));

    return NextResponse.json(
      { success: true, message: 'Chat history cleared' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Redis DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to clear chat history' },
      { status: 500 }
    );
  }
};
