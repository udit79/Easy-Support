# Easy Support

Easy Support is an AI-powered support chat application built with Next.js 16, React 19, Prisma, PostgreSQL, Better Auth, OpenAI Agents SDK, and TanStack Query.

Customers can create conversations, chat with specialized AI agents, and escalate unresolved issues to a human support agent. Administrators can review, reply to, and resolve those escalated tickets.

## Features

- Email and password authentication
- Multiple customer conversations
- Streaming AI responses
- Automatic conversation titles from the first message
- Billing, shipping, and technical specialist agents
- Human-support escalation tickets
- Human reply and ticket resolution
- Chat locked while a human ticket is open
- Light and dark themes
- Role-based admin access

## Technology

| Area           | Technology                              |
| -------------- | --------------------------------------- |
| Framework      | Next.js 16 App Router                   |
| UI             | React 19, Tailwind CSS, Base UI, Lucide |
| Authentication | Better Auth                             |
| Database       | PostgreSQL / Neon                       |
| ORM            | Prisma 7                                |
| AI             | OpenAI Agents SDK                       |
| Client state   | TanStack Query                          |
| Tables         | TanStack Table                          |
| Validation     | Zod                                     |

## Prerequisites

- Node.js 20.19 or newer
- pnpm 12 or newer
- A PostgreSQL database, such as Neon
- An OpenAI API key

## Environment variables

Create a `.env` file in the project root:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
BETTER_AUTH_SECRET="generate-a-long-random-secret"
BETTER_AUTH_URL="http://localhost:3000"
OPENAI_API_KEY="sk-..."
```

Generate a secure auth secret with:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Never commit `.env` or real API credentials. A copyable placeholder template is available in `.env.example`.

## Installation

```powershell
pnpm install
pnpm prisma generate
pnpm prisma migrate deploy
pnpm dev
```

Open `http://localhost:3000`.

For local development with an existing migration history:

```powershell
pnpm prisma migrate dev
```

To inspect or edit database records:

```powershell
pnpm prisma studio
```

## Database setup

The Prisma schema contains:

- `User`, `Session`, `Account`, and `Verification` for authentication
- `Conversation` and `Message` for chat history
- `Ticket` for human escalation requests
- `UserRole`, `MESSAGE_ROLE`, `TicketPriority`, and `TicketStatus` enums

If the database schema is already configured in Neon, generate the client and deploy migrations:

```powershell
pnpm prisma generate
pnpm prisma migrate deploy
```

After schema changes, create a migration:

```powershell
pnpm prisma migrate dev --name describe_the_change
```

## Authentication

Users can sign up and sign in through:

- `/sign-up`
- `/sign-in`

Authentication uses Better Auth with the PostgreSQL Prisma adapter. Protected server actions obtain the current session and enforce ownership before reading or modifying conversations and tickets.

## Chat behavior

A new conversation initially uses the title `New chat`. Its title is automatically replaced after the first user message with a concise title based on that prompt. Only conversations still using an untitled name are renamed.

The chat route is `POST /api/chat`. It:

1. Validates the signed-in session.
2. Verifies that the conversation belongs to the user.
3. Checks whether a human ticket is already open.
4. Streams the AI response as newline-delimited JSON events.
5. Stores the assistant response, active agent, and used tools.

## AI agents

- Triage agent: understands the request and chooses a specialist
- Billing agent: invoices, payments, refunds, and billing disputes
- Shipping agent: order tracking and delivery status
- Technical agent: troubleshooting, knowledge base, tickets, and technical issues
- Human escalation tool: creates or reuses an open support ticket

The triage and specialist agents can create escalation tickets when the user requests a human agent.

## Human support tickets

The following flow is used:

1. A user asks to speak with a human.
2. The agent calls `create_human_escalation_ticket`.
3. A ticket is created with `OPEN` status.
4. Further AI responses are disabled for that conversation.
5. An administrator replies or resolves the ticket.
6. Resolving the ticket re-enables AI chat for the conversation.

Tickets use `LOW`, `MEDIUM`, `HIGH`, or `URGENT` priorities and `OPEN`, `IN_PROGRESS`, or `RESOLVED` statuses.

## Admin access

Set a user's Prisma `role` to `ADMIN`:

```powershell
pnpm prisma studio
```

In Prisma Studio, open the `User` table and change the user's `role` field to `ADMIN`.

After signing in, open:

```text
/admin/tickets
```

The `/admin` URL redirects to `/admin/tickets`. Both server-side route checks and admin server actions verify the signed-in user's role.

## Commands

```powershell
pnpm dev             # Start the development server
pnpm build           # Create a production build
pnpm start           # Start the production server
pnpm lint            # Run ESLint
pnpm prisma generate # Generate the Prisma client
pnpm prisma validate # Validate the Prisma schema
pnpm prisma migrate dev # Create and apply a development migration
pnpm prisma migrate deploy # Apply migrations
pnpm prisma studio   # Open Prisma Studio
```

## Project structure

```text
app/
  admin/tickets/       Admin ticket page
  api/chat/            Streaming chat API route
  api/auth/            Better Auth routes
  sign-in/             Sign-in page
  sign-up/             Sign-up page
components/ui/         Reusable UI components
modules/
  ai/                  Agents, tools, prompts, and streaming logic
  admin/               Admin queries and ticket actions
  auth/                Authentication actions
  conversations/       Conversation queries and mutations
  messages/            Message queries and chat streaming
  tickets/             Ticket queries and hooks
lib/
  auth.ts              Better Auth configuration
  db.ts                Prisma database client
prisma/
  schema.prisma        Database schema
  migrations/          Prisma migrations
```

## Development notes

- Add reusable UI components under `components/ui`.
- Keep domain logic in `modules/<feature>`.
- Mark client-only components with `"use client"`.
- Protect both pages and server actions for authenticated or admin operations.
- Re-run `pnpm prisma generate` after changing `prisma/schema.prisma`.
- Restart the development server after environment-variable changes.
