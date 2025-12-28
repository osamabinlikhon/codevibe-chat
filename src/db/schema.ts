import { pgTable, serial, text, timestamp, varchar, jsonb } from 'drizzle-orm/pg-core';

// Chat sessions table
export const chatSessions = pgTable('chat_sessions', {
  id: serial('id').primaryKey(),
  sessionId: varchar('session_id', { length: 255 }).notNull().unique(),
  userId: varchar('user_id', { length: 255 }),
  title: text('title'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Chat messages table
export const chatMessages = pgTable('chat_messages', {
  id: serial('id').primaryKey(),
  sessionId: varchar('session_id', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(),
  content: text('content').notNull(),
  attachments: jsonb('attachments').$type<Array<{ url: string; name: string; type: string }>>(),
  model: varchar('model', { length: 100 }),
  tokens: serial('tokens'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User feedback table
export const feedback = pgTable('feedback', {
  id: serial('id').primaryKey(),
  messageId: varchar('message_id', { length: 255 }),
  rating: varchar('rating', { length: 20 }).notNull(), // 'thumbs_up' or 'thumbs_down'
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Generated code snippets table
export const codeSnippets = pgTable('code_snippets', {
  id: serial('id').primaryKey(),
  sessionId: varchar('session_id', { length: 255 }).notNull(),
  language: varchar('language', { length: 100 }).notNull(),
  code: text('not null'),
  description: text('description'),
  tags: varchar('tags', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Type exports for TypeScript
export type ChatSession = typeof chatSessions.$inferSelect;
export type NewChatSession = typeof chatSessions.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;
export type Feedback = typeof feedback.$inferSelect;
export type NewFeedback = typeof feedback.$inferInsert;
export type CodeSnippet = typeof codeSnippets.$inferSelect;
export type NewCodeSnippet = typeof codeSnippets.$inferInsert;
