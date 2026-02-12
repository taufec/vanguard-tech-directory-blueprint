# Vanguard Directory

[![Deploy to Cloudflare][cloudflarebutton]]

A production-ready full-stack chat application built on Cloudflare Workers. This project demonstrates a scalable, type-safe architecture using Durable Objects for multi-tenant entity storage (users, chats, messages), Hono for routing, and a modern React frontend with shadcn/ui.

## Features

- **Multi-Entity Durable Objects**: Single Global DO manages Users, ChatBoards, and Messages with atomic operations, CAS, and prefix indexes for efficient listing.
- **Real-time Chat**: Per-chat Durable Object storage with message history and indexed discovery.
- **Type-Safe API**: Shared types between frontend and worker with full CRUD operations (create, list, delete, paginated).
- **Modern UI**: React 18 with Tailwind CSS, shadcn/ui components, TanStack Query, and theme support (light/dark).
- **Serverless-First**: Zero-config deployment to Cloudflare Workers with SPA asset handling.
- **Production Ready**: Error boundaries, logging, CORS, health checks, and client error reporting.
- **Seed Data**: Auto-populates demo users/chats on first run.

## Tech Stack

- **Backend**: Cloudflare Workers, Hono, Durable Objects (SQLite-backed)
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Lucide icons
- **Data/State**: TanStack Query, Zustand, React Hook Form, Zod
- **Utils**: Immer, Framer Motion, Sonner (toasts), Vaul (drawers)
- **Dev Tools**: Bun, Wrangler, ESLint, TypeScript
- **Charts/Advanced**: Recharts, Embla Carousel (ready for use)

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (package manager)
- [Cloudflare Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- Cloudflare account (free tier sufficient)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Generate Worker types (if needed):
   ```bash
   bun run cf-typegen
   ```

### Local Development

1. Start the dev server:
   ```bash
   bun run dev
   ```
   - Frontend: http://localhost:3000 (or `${PORT:-3000}`)
   - Worker API: Automatically proxied via Vite

2. Open http://localhost:3000 in your browser.

3. Test API endpoints:
   ```bash
   curl http://localhost:3000/api/health
   curl http://localhost:3000/api/users
   ```

### Usage Examples

- **List Users**: `GET /api/users?limit=10&cursor=abc`
- **Create User**: `POST /api/users` with `{ "name": "John Doe" }`
- **Create Chat**: `POST /api/chats` with `{ "title": "My Chat" }`
- **Send Message**: `POST /api/chats/:chatId/messages` with `{ "userId": "u1", "text": "Hello!" }`
- **List Messages**: `GET /api/chats/:chatId/messages`

Full API in `worker/user-routes.ts` – extend by adding routes there.

## Deployment

Deploy to Cloudflare Workers in one command:

```bash
bun run deploy
```

Or manually:

1. Login: `npx wrangler login`
2. Deploy: `npx wrangler deploy`

Configuration in `wrangler.jsonc`:
- Global Durable Object auto-migrates on deploy.
- Assets served as SPA (single-page app).
- API routes (`/api/*`) handled by Worker first.

[![Deploy to Cloudflare][cloudflarebutton]]

**Pro Tip**: Use Cloudflare Pages for frontend-only deploys or bind Workers for hybrid setups.

## Project Structure

```
├── shared/          # Shared types & mock data
├── src/             # React frontend (Vite)
├── worker/          # Cloudflare Worker (Hono + DOs)
├── tailwind.config.js # UI theming
└── wrangler.jsonc   # DO bindings & migrations
```

## Customization

- **Add Entities**: Extend `worker/entities.ts` with `IndexedEntity`.
- **New Routes**: Add to `worker/user-routes.ts` (auto-reloads in dev).
- **UI Components**: Use shadcn/ui (`npx shadcn-ui@latest add <component>`).
- **Theme**: Edit `src/index.css` vars or `tailwind.config.js`.

## Architecture Overview

```
Browser → Vite Assets or /api/* → Worker (Hono)
          ↓
Global DO (SQLite) → Entities (User/ChatBoard) + Indexes
```

Each entity gets its own DO instance (`entityName:id`). Indexes enable `O(1)` listing/pagination.

## Contributing

1. Fork & clone
2. `bun install`
3. Make changes
4. Test locally: `bun run dev`
5. Deploy preview: `bun run deploy`
6. PR with clear description

## License

MIT License – see [LICENSE](LICENSE) for details.