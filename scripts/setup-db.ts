import { client } from '../src/lib/db';

async function setupDatabase() {
  console.log('Setting up database tables...');

  try {
    // Create chat_sessions table
    await client`
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL UNIQUE,
        user_id VARCHAR(255),
        title TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;
    console.log('✓ Created chat_sessions table');

    // Create chat_messages table
    await client`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        attachments JSONB,
        model VARCHAR(100),
        tokens INTEGER,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;
    console.log('✓ Created chat_messages table');

    // Create feedback table
    await client`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        message_id VARCHAR(255),
        rating VARCHAR(20) NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;
    console.log('✓ Created feedback table');

    // Create code_snippets table
    await client`
      CREATE TABLE IF NOT EXISTS code_snippets (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        language VARCHAR(100) NOT NULL,
        code TEXT NOT NULL,
        description TEXT,
        tags VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;
    console.log('✓ Created code_snippets table');

    // Create indexes for better query performance
    await client`CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);`;
    await client`CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at);`;
    await client`CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON chat_sessions(user_id);`;
    console.log('✓ Created indexes');

    console.log('\nDatabase setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}

// Run setup
setupDatabase()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Setup failed:', error);
    process.exit(1);
  });
