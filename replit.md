# KidsZone Learning Games (童樂學園)

## Overview

A children's educational gaming platform built with React and Express, featuring 13 interactive learning games in Traditional Chinese. The application includes games for:
- **Core subjects**: Colors, Math, English vocabulary, Shapes, Clock reading
- **Language**: Bopomofo (Chinese phonetic symbols), Melody recognition
- **Life skills**: Emotion recognition, Coding basics, Plant growth, Shopping/money, Recycling, Memory training

Players earn points, collect virtual stickers as rewards, and unlock achievement certificates that can be printed.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with custom "macaron" pastel color palette
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Animations**: Framer Motion for game interactions and feedback
- **Drag & Drop**: @dnd-kit for shape and emotion matching games
- **Build Tool**: Vite with HMR support

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **API Design**: RESTful endpoints defined in shared/routes.ts with Zod validation
- **Session Storage**: PostgreSQL via connect-pg-simple

### Data Flow
- Game logic runs entirely client-side for immediate feedback
- Server only handles high score persistence
- Scores table stores player name, game type, and score with timestamps

### Key Design Patterns
- **Shared Schema**: Database schema and API types defined in `/shared` directory, consumed by both client and server
- **Type-Safe API**: Zod schemas validate both request inputs and response shapes
- **Component Composition**: GameShell component wraps all games with consistent UI (score display, progress, game-over dialog)
- **Custom Hooks**: Reusable hooks for TTS (text-to-speech), scores API, and mobile detection

### Game Implementation
Each game follows a consistent pattern:
1. 10-question rounds with randomized content
2. Visual/audio feedback on correct/incorrect answers
3. Confetti celebration on correct answers
4. Sticker rewards system stored in localStorage
5. High score submission to server on game completion

### Certificate System
- 4 unlockable achievements based on scores and sticker collection
- Printable certificates with player names
- Achievement badges: Math Master, Word Explorer, Sticker Collector, Super Kid
- Progress tracked via localStorage and server scores

### Recent Additions (January 2026)
- **Coding Adventure**: Grid-based unplugged coding game with command blocks
- **Magic Garden**: Plant growth sequence learning (seed→water→sun→fertilize)
- **Supermarket Helper**: Shopping simulation with coin-based money calculation
- **Happy Recycle**: Drag-and-drop trash sorting game
- **Memory Forest**: Classic card matching memory game
- **Certificate System**: Achievement badges with printable rewards

## External Dependencies

### Database
- **PostgreSQL**: Primary data store via DATABASE_URL environment variable
- **Drizzle Kit**: Schema migrations stored in `/migrations` directory

### Third-Party Services
- **Google Fonts**: Architects Daughter (display), Outfit (body), Fira Code (mono)
- **Web Speech API**: Browser-native TTS for reading game content aloud in Traditional Chinese

### Key npm Packages
- `canvas-confetti`: Celebration effects on correct answers
- `@dnd-kit/core` & `@dnd-kit/sortable`: Drag-and-drop game mechanics
- `framer-motion`: Complex animations for game feedback
- `react-day-picker`: Calendar component for UI library

### Development Tools
- Replit Vite plugins for development experience (error overlay, cartographer, dev banner)
- esbuild for server bundling with specific dependency allowlist for cold start optimization