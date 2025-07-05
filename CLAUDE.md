# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Conquest" - a SvelteKit web application for tracking planetary battles and faction control over the planets for Warhammer 40K. The app uses Supabase for authentication and data management, with Tailwind CSS for styling.

## Architecture

### Tech Stack

- **Frontend**: SvelteKit 2.x with Svelte 5 (see docs: https://svelte.dev/docs/svelte/llms-medium.txt)
- **Styling**: Tailwind CSS 4.x with custom components
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (via @sveltejs/adapter-vercel)
- **UI Components**: bits-ui, vaul-svelte, layerchart for data visualization

### Key Directory Structure

- `src/lib/` - Shared utilities and components
  - `components/` - Reusable UI components organized by domain (auth, planet)
  - `supabaseClient.ts` - Database client configuration
  - `types.ts` - TypeScript interfaces for core entities
- `src/routes/` - SvelteKit file-based routing
  - `auth/` - Authentication flows (login, signup, confirmation)
  - `private/` - Protected routes requiring authentication
    - `upload/` - Battle result submission
    - `user/` - User profile management

### Core Data Models

- **Planet**: Represents game world locations with battles and faction control
- **Battle**: Combat events with attacker/defender, points, and results
- **FactionControl**: Tracks which factions control which planets
- **User**: Player profiles with battle statistics and faction allegiance

### Authentication Flow

Uses Supabase Auth with server-side session management. Protected routes are handled via `+layout.server.ts` files that check authentication status.

### State Management

Relies on SvelteKit's built-in state management with server-side data loading through `+page.server.ts` files. Real-time updates likely handled through Supabase subscriptions.

## Environment Variables

Requires Supabase configuration:

- `PUBLIC_SUPABASE_URL` - Supabase project URL
- `PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
