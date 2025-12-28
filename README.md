# CodeVibe Chat - AI-Powered Code Generation Platform

CodeVibe Chat is a powerful AI-powered code generation platform built with Next.js 14, featuring real-time code execution, chat history persistence, file uploads, and seamless integration with modern AI and development tools.

## Features

### 🤖 AI-Powered Code Generation
- Generate production-ready code using natural language prompts
- Support for multiple programming languages (React, TypeScript, Python, etc.)
- Streaming responses for real-time code generation
- Syntax highlighting with shiki

### 🔐 Secure Code Execution
- Run Python code securely using E2B sandbox environment
- Execute code directly in your browser with immediate feedback
- Safe, isolated execution environment

### 💬 Persistent Chat History
- Save and retrieve chat sessions with Neon Postgres
- Automatic message persistence with Drizzle ORM
- View and manage previous conversations
- Organize code snippets from conversations

### 📁 File Upload & Storage
- Upload images and documents via Vercel Blob
- Attach files to chat messages
- Automatic file type validation
- Secure, public access to uploaded content

### 🚀 Modern Tech Stack
- Next.js 14 with App Router
- React Server Components
- Tailwind CSS for styling
- TypeScript for type safety

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14.2.14** | React Framework |
| **Vercel AI SDK** | AI Integration (@ai-sdk/react, @ai-sdk/openai) |
| **Groq** | LLM Provider (Llama 3 models) |
| **E2B** | Secure Code Execution Sandbox |
| **Neon Postgres** | Database with Drizzle ORM |
| **Upstash Redis** | Caching and Session Management |
| **Vercel Blob** | File Storage |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | UI Components |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- API keys for:
  - [Groq](https://console.groq.com)
  - [E2B](https://e2b.dev)
  - [Vercel](https://vercel.com) (for Blob storage)
  - [Neon](https://neon.tech) (Postgres database)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/osamabinlikhon/codevibe-chat.git
cd codevibe-chat
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local` file with the following variables:

```env
# Groq API Key
GROQ_API_KEY=your_groq_api_key_here

# E2B API Key
E2B_API_KEY=your_e2b_api_key_here

# GitHub Configuration (optional)
GITHUB_TOKEN=your_github_token_here
GITHUB_ORG=your_org
GITHUB_REPO=codevibe-chat

# Upstash Redis Configuration
KV_REST_API_READ_ONLY_TOKEN=your_read_only_token
KV_REST_API_TOKEN=your_token
KV_REST_API_URL=https://your-upstash-url.upstash.io

# Vercel Blob Configuration
BLOB_READ_WRITE_TOKEN=your_blob_token

# Neon Postgres Configuration
DATABASE_URL=postgresql://user:password@host/database
POSTGRES_URL=postgresql://user:password@host/database
POSTGRES_PRISMA_URL=postgresql://user:password@host/database?connect_timeout=15&sslmode=require
```

5. Set up the database:
```bash
npm run db:setup
```

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
codevibe-chat/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/              # Main chat API route (code generation)
│   │   │   ├── chat-history/      # Redis-based chat history API
│   │   │   ├── db-chat-history/   # Postgres-based chat history API
│   │   │   └── upload/            # File upload endpoint (Vercel Blob)
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Main chat interface (AI Elements)
│   ├── components/
│   │   ├── chat/
│   │   │   ├── sidebar.tsx        # Chat sidebar with history
│   │   │   └── file-upload.tsx    # File upload component
│   │   └── ui/                    # shadcn/ui components
│   ├── lib/
│   │   ├── db.ts                  # Database connection (Neon + Drizzle)
│   │   ├── chat-db.ts             # Chat database operations
│   │   └── e2b.ts                 # E2B sandbox setup
│   └── db/
│       └── schema.ts              # Database schema definitions
├── scripts/
│   └── setup-db.ts                # Database setup script
├── public/                        # Static assets
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## API Routes

### POST /api/chat
Main chat API endpoint for code generation using AI Elements.

```typescript
// Request
{
  "prompt": "Create a React button component"
}

// Response (streaming)
{
  "code": "export function Button() { ... }",
  "language": "typescript"
}
```

### GET /api/db-chat-history
Retrieve chat sessions and messages from Neon Postgres.

```typescript
// Get user sessions
GET /api/db-chat-history?action=sessions&userId=xxx

// Response
{
  "sessions": [
    {
      "id": 1,
      "session_id": "abc123",
      "title": "React Component Chat",
      "created_at": "2025-12-28T10:00:00Z",
      "updated_at": "2025-12-28T12:00:00Z"
    }
  ]
}

// Get messages in a session
GET /api/db-chat-history?action=messages&sessionId=xxx

// Response
{
  "messages": [
    {
      "id": 1,
      "session_id": "abc123",
      "role": "user",
      "content": "Create a button component",
      "attachments": [],
      "created_at": "2025-12-28T10:00:00Z"
    }
  ]
}
```

### POST /api/upload
Upload files to Vercel Blob storage.

```typescript
// Request (multipart/form-data)
POST /api/upload?filename=image.png
Body: <file binary>

// Response
{
  "url": "https://public.blob.vercel-storage.com/filename.png",
  "pathname": "filename.png",
  "contentType": "image/png",
  "size": 12345,
  "uploadedAt": "2025-12-28T10:00:00Z"
}
```

### GET /api/chat-history
Redis-based chat history (alternative storage).

```typescript
// Get chat history
GET /api/chat-history?sessionId=xxx

// Store a message
POST /api/chat-history
Body: { "sessionId": "xxx", "message": { "role": "user", "content": "Hello" } }

// Clear chat history
DELETE /api/chat-history?sessionId=xxx
```

## Database Schema

### chat_sessions
Stores chat session metadata.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| session_id | VARCHAR(255) | Unique session identifier |
| user_id | VARCHAR(255) | User identifier |
| title | TEXT | Session title |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### chat_messages
Stores all chat messages.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| session_id | VARCHAR(255) | Session identifier |
| role | VARCHAR(50) | Message role (user/assistant) |
| content | TEXT | Message content |
| attachments | JSONB | Array of file attachments |
| model | VARCHAR(100) | AI model used |
| tokens | INTEGER | Token count |
| created_at | TIMESTAMP | Message timestamp |

### feedback
Stores user feedback for messages.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| message_id | VARCHAR(255) | Message identifier |
| rating | VARCHAR(20) | thumbs_up or thumbs_down |
| comment | TEXT | Feedback comment |
| created_at | TIMESTAMP | Feedback timestamp |

### code_snippets
Stores generated code snippets.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| session_id | VARCHAR(255) | Session identifier |
| language | VARCHAR(100) | Programming language |
| code | TEXT | Generated code |
| description | TEXT | Code description |
| tags | VARCHAR(500) | Comma-separated tags |
| created_at | TIMESTAMP | Creation timestamp |

## Features in Detail

### Code Generation
Use natural language to generate production-ready code. The AI understands context and can:
- Create React/Next.js components
- Write API routes and server functions
- Generate TypeScript interfaces
- Build full-stack applications

### Secure Code Execution
Execute Python code directly in your chat:
- Data analysis and visualization
- Algorithm implementation
- Quick prototyping
- Safe, sandboxed environment (E2B)

### Chat Persistence
Your conversations are saved automatically:
- Sessions persist across page reloads
- Message history stored in Neon Postgres
- Easy retrieval of previous conversations
- Organize code snippets from chats

### File Upload
Upload files to attach to your chats:
- Support for images (JPEG, PNG, WebP)
- Support for documents (TXT, JSON, MD)
- Files stored in Vercel Blob
- Automatic public URL generation

### Chat Sidebar
Navigate your conversations easily:
- View all chat sessions
- Quick access to recent chats
- Create new chats instantly
- Delete conversations
- Feature navigation

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
# Deploy to production
vercel --prod

# Or link and deploy
vercel link
vercel --prod
```

### Docker

```bash
docker build -t codevibe-chat .
docker run -p 3000:3000 -e DATABASE_URL="..." codevibe-chat
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | API key for Groq LLM | Yes |
| `E2B_API_KEY` | API key for E2B code execution | Yes |
| `DATABASE_URL` | Neon Postgres connection string | Yes |
| `KV_REST_API_TOKEN` | Upstash Redis token | No |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token | No |
| `GITHUB_TOKEN` | GitHub token for MCP integration | No |

## MCP Server Integration

CodeVibe Chat supports Model Context Protocol (MCP) servers for enhanced AI capabilities:

### Vercel MCP
- Project and deployment management
- Domain configuration
- Integration management

### GitHub MCP
- Repository operations
- Issue and PR management
- Workflow monitoring

### Chrome DevTools MCP
- Browser automation
- Page interaction
- Screenshot capture

Configure MCP servers in `.vscode/mcp-complete.json`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Vercel](https://vercel.com) - Deployment and AI SDK
- [Groq](https://groq.com) - Fast AI inference
- [E2B](https://e2b.dev) - Secure code execution
- [Neon](https://neon.tech) - Serverless Postgres
- [Upstash](https://upstash.com) - Serverless Redis
- [shadcn/ui](https://ui.shadcn.com) - Beautiful UI components
- [Drizzle ORM](https://orm.drizzle.team) - Type-safe database ORM

---

**Happy Vibe Coding!** 🚀

Transform your ideas into production-ready applications with CodeVibe Chat!
