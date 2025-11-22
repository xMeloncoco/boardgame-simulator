# Board Game Simulator

A versatile web-based board game simulator for creating and playing digital versions of physical board games.

## Project Status: Phase 1 Complete ✓

**Current Version:** 0.1.0

### Completed Features (Phase 1: Foundation)
- ✓ React + TypeScript project with Vite
- ✓ Project structure (components, hooks, utils, types, stores, screens)
- ✓ Core dependencies installed (Konva.js, Zustand, React Router)
- ✓ ESLint and Prettier configuration
- ✓ Basic routing and navigation
- ✓ Placeholder screens (Menu, Game List, Create, Settings, Game Play)
- ✓ Type definitions for game components and state
- ✓ Zustand store for game state management

### Tech Stack
- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite
- **Game Rendering:** Konva.js (ready for Phase 3)
- **State Management:** Zustand
- **Routing:** React Router v7
- **Linting:** ESLint + Prettier

## Getting Started

### Prerequisites
- Node.js v18 or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

### Development Server
The app runs on `http://localhost:3000/`

## Project Structure

```
boardgame-simulator/
├── src/
│   ├── components/      # Reusable UI components (Phase 2+)
│   ├── hooks/           # Custom React hooks (Phase 2+)
│   ├── screens/         # Main application screens
│   │   ├── MenuScreen.tsx
│   │   ├── GameListScreen.tsx
│   │   ├── CreateGameScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── GamePlayScreen.tsx
│   ├── stores/          # Zustand state stores
│   │   └── gameStore.ts
│   ├── types/           # TypeScript type definitions
│   │   ├── game.ts
│   │   └── gameDefinition.ts
│   ├── utils/           # Utility functions (Phase 2+)
│   ├── assets/          # Images and static assets
│   ├── App.tsx          # Main app component with routing
│   ├── main.tsx         # React entry point
│   └── index.css        # Global styles
├── DEVELOPMENT_PHASES.md  # Detailed development roadmap
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Type System

### Core Types

**GameComponent** - Base interface for all game components:
- `Token` - Flippable game tokens (coins, fish, etc.)
- `Card` - Playing cards with front/back
- `Container` - Bags, decks, hands, piles
- `Area` - Board zones and placement areas

**GameState** - Central game state:
- Components map
- Variables map (money, round, etc.)
- Current phase
- Action history

**GameDefinition** - JSON schema for defining games:
- Game info (name, version, player count)
- Component definitions
- Variables
- Phases
- Setup instructions
- Win/lose conditions

## Roadmap

See [DEVELOPMENT_PHASES.md](DEVELOPMENT_PHASES.md) for the complete roadmap.

### Next Steps (Phase 2: Game Engine Core)
- [ ] Action system (create, move, flip, remove components)
- [ ] Component management
- [ ] State serialization (save/load)
- [ ] Action history and undo/redo

### Target Games
1. **Conservas** (Phase 6) - First implementation
2. **Kinfire Delve: Scorn's Stockade** (Phase 9)
3. **Riftforce** with Solo Automa (Phase 9)
4. **Spirit Island** (Phase 9)

## Development Philosophy

- **MVP First:** Get Conservas playable before adding complexity
- **Type Safety:** Strong TypeScript typing throughout
- **Component Architecture:** Modular, reusable components
- **JSON-Driven:** Games defined in JSON with JavaScript scripting
- **Progressive Enhancement:** Start simple, add features incrementally

## Contributing

This is currently a personal project. See development phases for planned features.

## License

ISC

---

**Phase 1 Status:** ✅ Complete - Basic infrastructure is ready!
