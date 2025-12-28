import { db, client } from './db';
import {
  chatSessions,
  chatMessages,
  feedback,
  codeSnippets,
  type ChatSession,
  type NewChatSession,
  type ChatMessage,
  type NewChatMessage,
  type Feedback,
  type NewFeedback,
  type CodeSnippet,
  type NewCodeSnippet,
} from '../../db/schema';
import { eq, desc, asc, like } from 'drizzle-orm';

// ==================== Chat Sessions ====================

export async function createSession(data: NewChatSession): Promise<ChatSession[]> {
  return db.insert(chatSessions).values(data).returning();
}

export async function getSession(sessionId: string): Promise<ChatSession[]> {
  return db
    .select()
    .from(chatSessions)
    .where(eq(chatSessions.sessionId, sessionId));
}

export async function getUserSessions(userId: string): Promise<ChatSession[]> {
  return db
    .select()
    .from(chatSessions)
    .where(eq(chatSessions.userId, userId))
    .orderBy(desc(chatSessions.updatedAt));
}

export async function updateSession(
  sessionId: string,
  data: Partial<NewChatSession>
): Promise<ChatSession[]> {
  return db
    .update(chatSessions)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(chatSessions.sessionId, sessionId))
    .returning();
}

export async function deleteSession(sessionId: string): Promise<void> {
  // Delete all messages in the session first
  await client`DELETE FROM chat_messages WHERE session_id = ${sessionId}`;
  // Then delete the session
  await db.delete(chatSessions).where(eq(chatSessions.sessionId, sessionId));
}

// ==================== Chat Messages ====================

export async function createMessage(data: NewChatMessage): Promise<ChatMessage[]> {
  return db.insert(chatMessages).values(data).returning();
}

export async function getSessionMessages(
  sessionId: string,
  limit = 100
): Promise<ChatMessage[]> {
  return db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.sessionId, sessionId))
    .orderBy(asc(chatMessages.createdAt))
    .limit(limit);
}

export async function getRecentMessages(
  sessionId: string,
  count = 10
): Promise<ChatMessage[]> {
  return db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.sessionId, sessionId))
    .orderBy(desc(chatMessages.createdAt))
    .limit(count);
}

export async function deleteMessage(id: number): Promise<void> {
  await db.delete(chatMessages).where(eq(chatMessages.id, id));
}

// ==================== Feedback ====================

export async function createFeedback(data: NewFeedback): Promise<Feedback[]> {
  return db.insert(feedback).values(data).returning();
}

export async function getMessageFeedback(messageId: string): Promise<Feedback[]> {
  return db
    .select()
    .from(feedback)
    .where(eq(feedback.messageId, messageId));
}

export async function getAllFeedback(limit = 100): Promise<Feedback[]> {
  return db
    .select()
    .from(feedback)
    .orderBy(desc(feedback.createdAt))
    .limit(limit);
}

// ==================== Code Snippets ====================

export async function saveCodeSnippet(data: NewCodeSnippet): Promise<CodeSnippet[]> {
  return db.insert(codeSnippets).values(data).returning();
}

export async function getSessionSnippets(sessionId: string): Promise<CodeSnippet[]> {
  return db
    .select()
    .from(codeSnippets)
    .where(eq(codeSnippets.sessionId, sessionId))
    .orderBy(desc(codeSnippets.createdAt));
}

export async function searchSnippets(query: string): Promise<CodeSnippet[]> {
  return db
    .select()
    .from(codeSnippets)
    .where(like(codeSnippets.tags, `%${query}%`))
    .orderBy(desc(codeSnippets.createdAt))
    .limit(50);
}

// ==================== Statistics ====================

export async function getSessionStats(sessionId: string) {
  const messages = await client`
    SELECT
      COUNT(*) as total_messages,
      COUNT(CASE WHEN role = 'user' THEN 1 END) as user_messages,
      COUNT(CASE WHEN role = 'assistant' THEN 1 END) as assistant_messages,
      SUM(tokens) as total_tokens
    FROM chat_messages
    WHERE session_id = ${sessionId}
  `;
  return messages[0];
}

export async function getOverallStats() {
  const stats = await client`
    SELECT
      (SELECT COUNT(*) FROM chat_sessions) as total_sessions,
      (SELECT COUNT(*) FROM chat_messages) as total_messages,
      (SELECT COUNT(*) FROM feedback) as total_feedback,
      (SELECT COUNT(*) FROM code_snippets) as total_snippets
  `;
  return stats[0];
}
