# Board Game Simulator - Development Phases

## Project Overview
A web-based board game simulator that allows creating and playing digital versions of physical board games, with scripted automa opponents. Primary target: Conservas, with architecture supporting Kinfire Delve, Riftforce, and Spirit Island.

## Tech Stack
- **Frontend:** React + TypeScript
- **Game Rendering:** Konva.js (2D canvas)
- **State Management:** Zustand or Redux Toolkit
- **Game Definitions:** JSON files
- **Rule Scripting:** JavaScript with helper library
- **Storage:** IndexedDB (local) + Firebase (cloud sync for images)
- **Build Tool:** Vite

---

## Phase 1: Foundation (Weeks 1-2)
**Goal:** Basic project setup and core infrastructure

### 1.1 Project Setup
- [ ] Initialize React + TypeScript project with Vite
- [ ] Set up project structure (components, hooks, utils, types)
- [ ] Configure ESLint, Prettier
- [ ] Set up basic routing (React Router)
- [ ] Create main layout with navigation

### 1.2 Core Type Definitions
- [ ] Define base component types (Token, Card, Board, Bag)
- [ ] Define game state structure
- [ ] Define action/event system types
- [ ] Define game definition schema (JSON structure)

### 1.3 Basic UI Shell
- [ ] Main menu screen
- [ ] Game selection/creation screen placeholder
- [ ] Game play area placeholder
- [ ] Settings screen placeholder

**Deliverable:** Running app with navigation between empty screens

---

## Phase 2: Game Engine Core (Weeks 3-5)
**Goal:** Build the fundamental game engine that handles state and actions

### 2.1 State Management
- [ ] Game state store (current game, components, variables)
- [ ] Action history (undo/redo support)
- [ ] State serialization (save/load games)
- [ ] Local storage integration

### 2.2 Component System
- [ ] Base component class/interface
- [ ] Token component (with properties: type, value, image, flippable)
- [ ] Card component (size, front/back images, properties)
- [ ] Container component (bag, deck, hand, pile)
- [ ] Area component (board zones, placement areas)

### 2.3 Action System
- [ ] Action registry (all possible actions)
- [ ] Action executor
- [ ] Action validation
- [ ] Action logging

**Core Actions to Implement:**
```
Tokens:
- createToken(type, properties)
- moveToken(tokenId, targetContainer)
- removeToken(tokenId)
- flipToken(tokenId)

Cards:
- createCard(type, properties)
- moveCard(cardId, targetLocation)
- flipCard(cardId)
- shuffleDeck(deckId)
- drawCard(deckId, count)

Containers:
- addToContainer(itemId, containerId)
- removeFromContainer(itemId, containerId)
- shuffleContainer(containerId)
- drawFromContainer(containerId, count)

Variables:
- setVariable(name, value)
- incrementVariable(name, amount)
- decrementVariable(name, amount)
- getVariable(name)
```

**Deliverable:** Engine that can execute actions and maintain state

---

## Phase 3: Canvas Rendering (Weeks 6-8)
**Goal:** Visual representation of game components

### 3.1 Canvas Setup
- [ ] Konva.js stage and layers
- [ ] Responsive canvas sizing
- [ ] Camera controls (pan, zoom)
- [ ] Grid system for snapping

### 3.2 Component Renderers
- [ ] Token renderer (circular/square tokens with images)
- [ ] Card renderer (with front/back, hover preview)
- [ ] Deck renderer (stacked cards visualization)
- [ ] Bag renderer (container that hides contents)
- [ ] Board/area renderer (zones with borders)
- [ ] Hand renderer (fan of cards)

### 3.3 Interactions
- [ ] Drag and drop components
- [ ] Click to select
- [ ] Right-click context menu (flip, move, etc.)
- [ ] Double-click actions
- [ ] Hover tooltips

### 3.4 UI Overlays
- [ ] Current phase indicator
- [ ] Variable display (money, round counter)
- [ ] Action buttons
- [ ] Game log panel

**Deliverable:** Visual game board with interactive components

---

## Phase 4: Game Definition System (Weeks 9-11)
**Goal:** JSON-based game configuration

### 4.1 Schema Design
```json
{
  "gameInfo": {
    "name": "Conservas",
    "version": "1.0",
    "playerCount": { "min": 1, "max": 1 }
  },
  "components": {
    "tokens": [...],
    "cards": [...],
    "boards": [...],
    "containers": [...]
  },
  "variables": {
    "money": { "initial": 10, "type": "number" },
    "round": { "initial": 1, "type": "number" }
  },
  "phases": [...],
  "setup": [...],
  "winConditions": [...],
  "loseConditions": [...]
}
```

### 4.2 Game Loader
- [ ] Parse JSON game definitions
- [ ] Validate against schema
- [ ] Initialize game state from definition
- [ ] Error handling and reporting

### 4.3 Asset Management
- [ ] Image upload interface
- [ ] Image storage (IndexedDB for local)
- [ ] Image reference system in JSON
- [ ] Default/placeholder images

### 4.4 Phase System
- [ ] Define game phases in JSON
- [ ] Phase transitions
- [ ] Phase-specific available actions
- [ ] Phase completion conditions

**Deliverable:** Load and play games from JSON definitions

---

## Phase 5: Rule Scripting (Weeks 12-14)
**Goal:** JavaScript-based game logic

### 5.1 Script Environment
- [ ] Sandboxed JavaScript execution
- [ ] Helper function library
- [ ] Access to game state (read)
- [ ] Action dispatching (write)
- [ ] Event hooks (onPhaseStart, onAction, etc.)

### 5.2 Helper Library
```javascript
// Example helpers for Conservas
GameHelpers = {
  // Queries
  getTokensInContainer(containerId),
  getTokensByType(type),
  countTokens(containerId, filter),

  // Actions
  drawFromBag(bagId, count),
  spawnTokens(type, count, targetContainer),
  payMoney(amount),
  earnMoney(amount),

  // Conditions
  checkWinCondition(conditions),
  hasMinimumFish(type, count),

  // Phase helpers
  getCurrentPhase(),
  advancePhase(),
  endRound()
}
```

### 5.3 Event System
- [ ] onGameStart
- [ ] onRoundStart / onRoundEnd
- [ ] onPhaseStart / onPhaseEnd
- [ ] onTokenPlaced / onTokenRemoved
- [ ] onCardPlayed / onCardPurchased
- [ ] onVariableChanged

### 5.4 Script Editor (Basic)
- [ ] Code editor with syntax highlighting (Monaco/CodeMirror)
- [ ] Script testing/debugging console
- [ ] Error display
- [ ] Template snippets

**Deliverable:** Games with custom logic defined in JavaScript

---

## Phase 6: Conservas Implementation (Weeks 15-17)
**Goal:** Fully playable Conservas

### 6.1 Components
- [ ] Fish tokens (Sardine, Scallop) - double-sided (fish/tin)
- [ ] Water tokens
- [ ] Money tokens (€1, €5, €10)
- [ ] Boat cards (with catch size, upkeep cost)
- [ ] Upgrade cards (with cost, effect)
- [ ] Market board (January month)
- [ ] Sea bag
- [ ] Open Water card
- [ ] Round marker

### 6.2 Game Flow
- [ ] Setup phase (load bag, initial boat selection)
- [ ] At Sea phase (draw tokens, place on boats)
- [ ] On Land phase (sell to market, buy upgrades/boats)
- [ ] End of Day phase (upkeep, spawning)
- [ ] Round progression
- [ ] Win/lose condition checking

### 6.3 Special Mechanics
- [ ] Market grid with requirements
- [ ] Fish spawning logic
- [ ] Upgrade card effects
- [ ] Boat upkeep system

### 6.4 Polish
- [ ] Phase instructions/tooltips
- [ ] Valid action highlighting
- [ ] Automatic calculations (spawning math)
- [ ] Game summary at end

**Deliverable:** Complete, playable Conservas game

---

## Phase 7: Game Creator UI (Weeks 18-21)
**Goal:** User-friendly game creation interface

### 7.1 Component Designer
- [ ] Token creator (shape, color, size, images)
- [ ] Card creator (dimensions, front/back images, properties)
- [ ] Board/area designer (draw zones, set properties)
- [ ] Container setup (decks, bags, hands)

### 7.2 Visual Board Editor
- [ ] Drag-and-drop component placement
- [ ] Resize and position areas
- [ ] Layer management
- [ ] Snap to grid

### 7.3 Variable & Phase Editor
- [ ] Define game variables
- [ ] Create phase structure
- [ ] Set phase transitions
- [ ] Define turn order

### 7.4 Rule Script Editor (Enhanced)
- [ ] Visual script templates
- [ ] Auto-complete for game objects
- [ ] Live preview of script effects
- [ ] Documentation sidebar

### 7.5 Game Exporter
- [ ] Export to JSON
- [ ] Import from JSON
- [ ] Validation and error reporting
- [ ] Game packaging (with assets)

**Deliverable:** Create new games without editing JSON directly

---

## Phase 8: Cloud Storage & Sync (Weeks 22-23)
**Goal:** Store games and assets in the cloud

### 8.1 Firebase Integration
- [ ] Firebase project setup
- [ ] Authentication (anonymous or simple login)
- [ ] Firestore for game definitions
- [ ] Firebase Storage for images

### 8.2 Sync Features
- [ ] Upload game definitions
- [ ] Upload game assets (images)
- [ ] Download/sync games across devices
- [ ] Version management

### 8.3 Game Library
- [ ] Browse saved games
- [ ] Game metadata (last played, progress)
- [ ] Delete/archive games

**Deliverable:** Access games from any device

---

## Phase 9: Additional Games (Weeks 24-28)
**Goal:** Prove versatility with different game types

### 9.1 Kinfire Delve: Scorn's Stockade
- Card-driven dungeon crawler
- Location cards with abilities
- Character progression
- Combat system

### 9.2 Riftforce (Solo Automa)
- Hand management
- Elemental card powers
- Automa opponent logic
- Scoring system

### 9.3 Spirit Island (Simplified)
- Area control board
- Power cards
- Invader logic
- Fear/blight system

**Deliverable:** Three additional games proving system flexibility

---

## Phase 10: Polish & Optimization (Weeks 29-30)
**Goal:** Improve performance and user experience

### 10.1 Performance
- [ ] Canvas rendering optimization
- [ ] State update batching
- [ ] Lazy loading of game assets
- [ ] Memory management

### 10.2 UX Improvements
- [ ] Tutorial/onboarding for game creation
- [ ] Keyboard shortcuts
- [ ] Accessibility features
- [ ] Mobile touch improvements

### 10.3 Documentation
- [ ] Game creation guide
- [ ] Script writing tutorial
- [ ] Component reference
- [ ] Example games library

**Deliverable:** Polished, well-documented application

---

## Future Phases (Not in Initial Scope)

### Phase 11: Visual Node Editor
- Node-based rule creation
- Connect actions and conditions visually
- No coding required for basic logic

### Phase 12: Multiplayer Support
- Real-time game state sync
- Turn management
- Chat/communication
- Lobby system

### Phase 13: AI Opponents
- Decision tree AI
- Difficulty levels
- Learning from play patterns

### Phase 14: Mobile Apps
- React Native or PWA
- Touch-optimized UI
- Offline support

---

## MVP Definition (Phases 1-6)
**Minimum Viable Product includes:**
1. Working game engine
2. Visual canvas with interactions
3. JSON game definitions
4. JavaScript rule scripting
5. One complete game (Conservas)
6. Save/load functionality

**Estimated Time:** 17 weeks (4-5 months with buffer)

---

## Development Approach

### Each Phase Should:
1. Have clear acceptance criteria
2. Be testable independently
3. Build on previous phases
4. Include basic error handling

### Code Quality Standards:
- TypeScript for type safety
- Component-based architecture
- Documented public APIs
- Unit tests for core logic
- Integration tests for game flow

### Version Control:
- Feature branches for each phase
- Regular commits with clear messages
- Tag releases at phase completion

---

## Getting Started Checklist

Before Phase 1:
- [ ] Install Node.js (v18+)
- [ ] Install VS Code with extensions (ESLint, Prettier, TypeScript)
- [ ] Set up GitHub repository
- [ ] Create Firebase project (for later phases)
- [ ] Gather Conservas asset images (or create placeholders)
- [ ] Read Konva.js documentation basics

---

## Risk Mitigation

**Risk:** Complex rule scripting is hard to debug
**Mitigation:** Extensive logging, step-through execution mode, clear error messages

**Risk:** Canvas performance with many components
**Mitigation:** Object pooling, viewport culling, layer optimization

**Risk:** Game definition schema needs frequent changes
**Mitigation:** Version schema, migration scripts, backwards compatibility

**Risk:** Scope creep with additional features
**Mitigation:** Strict MVP focus, feature backlog, regular scope review

---

## Success Metrics

### Phase 6 (MVP) Complete When:
- [ ] Conservas is fully playable from start to win/lose
- [ ] Game can be saved and resumed
- [ ] All phases (At Sea, On Land, End of Day) work correctly
- [ ] Fish spawning calculates correctly
- [ ] Win conditions are evaluated properly
- [ ] No critical bugs in 10 complete playthroughs

### Phase 9 Complete When:
- [ ] Three different games successfully implemented
- [ ] Each game uses different component combinations
- [ ] System demonstrates versatility
- [ ] Can create a simple new game in < 2 hours
