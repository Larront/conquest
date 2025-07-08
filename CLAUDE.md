# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Conquest" - a SvelteKit web application for tracking planetary battles and faction control over the planets for Warhammer 40K. The app uses Supabase for authentication and data management, with Tailwind CSS for styling.

## Context7 MCP Documentation References

For up-to-date documentation and API references, use Context7 MCP with these libraries:

- Use `context7 /supabase/supabase` for Supabase client and authentication APIs
- Use `context7 /sveltejs/svelte` for Svelte 5 component and reactive patterns
- Use `context7 /ciscoheat/sveltekit-superforms` for form validation and handling
- Use `context7 /colinhacks/zod` for schema validation patterns

## Architecture

### Tech Stack

- **Frontend**: SvelteKit 2.x with Svelte 5
- **Styling**: Tailwind CSS 4.x with bits-ui components
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **Authentication**: Supabase Auth with SSR
- **Forms**: sveltekit-superforms with Zod validation
- **Deployment**: Vercel (via @sveltejs/adapter-vercel)
- **UI Components**: bits-ui, vaul-svelte, layerchart for data visualization
- **Icons**: @lucide/svelte

### Key Directory Structure

- `src/lib/` - Shared utilities and components
  - `components/` - Reusable UI components organized by domain (auth, planet)
  - `hooks/` - Custom Svelte hooks (mobile detection, intersection observer)
  - `supabaseClient.ts` - Database client configuration
  - `types.ts` - TypeScript interfaces for core entities
  - `validation.ts` - Zod schemas for form validation
  - `utils.ts` - Utility functions
- `src/routes/` - SvelteKit file-based routing
  - `auth/` - Authentication flows (login, signup, confirmation, password reset)
  - `private/` - Protected routes requiring authentication
    - `upload/` - Battle result submission
    - `user/` - User profile management and faction selection

### Core Data Models

- **Planet**: Represents game world locations with battles and faction control
- **Battle**: Combat events with attacker/defender, points, and results
- **FactionControl**: Tracks which factions control which planets
- **User**: Player profiles with battle statistics and faction allegiance

### Authentication Flow

Uses Supabase Auth with server-side session management via `@supabase/ssr`. Protected routes are handled via `+layout.server.ts` files that check authentication status.

### State Management

Relies on SvelteKit's built-in state management with server-side data loading through `+page.server.ts` files. Real-time updates handled through Supabase subscriptions.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build the project
- `npm run build:analyze` - Build with bundle analysis
- `npm run check` - Run type checking
- `npm run lint` - Run linting and formatting checks
- `npm run format` - Format code with Prettier
- `npm run host` - Start dev server with network access

## Code Style Guidelines

- Use ES modules (import/export) syntax, not CommonJS
- Destructure imports when possible (e.g., `import { foo } from 'bar'`)
- Use Tailwind CSS classes for styling
- Follow Svelte 5 patterns with runes ($state, $effect, $derived)
- Use Zod schemas for all form validation
- Prefer TypeScript strict mode patterns

## Workflow

- Run `npm run check` when you're done making code changes
- Use `npm run lint` to check formatting and style
- Prefer running focused tests rather than full test suite
- Always validate forms with Zod schemas when using superforms
- Use the scratchpads folder to document your plans, creating markdown files for each plan with each step written down.

## Environment Variables

Requires Supabase configuration:

- `PUBLIC_SUPABASE_URL` - Supabase project URL
- `PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

## Dependencies

Key production dependencies:

- `@supabase/supabase-js` ^2.49.8 - Main Supabase client
- `@supabase/ssr` ^0.6.1 - Server-side rendering support
- `sveltekit-superforms` ^2.27.1 - Form handling with validation
- `zod` ^3.25.74 - Schema validation
- `bits-ui` ^2.4.0 - UI component library
- `vaul-svelte` ^0.3.2 - Drawer/modal components
- `layerchart` ^2.0.0-next.10 - Data visualization

Key development dependencies:

- `@sveltejs/kit` ^2.16.0 - SvelteKit framework
- `svelte` ^5.0.0 - Svelte framework
- `tailwindcss` ^4.0.0 - CSS framework
- `typescript` ^5.0.0 - TypeScript compiler
- `@lucide/svelte` ^0.511.0 - Icon library
