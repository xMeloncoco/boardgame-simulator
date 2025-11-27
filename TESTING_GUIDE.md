# Conservas Testing Guide

## Quick Start

```bash
npm run dev
```

Visit `http://localhost:3000`

## What's Ready to Test

You now have a **fully playable Conservas game** (January market scenario) with:

### Core Features
- ✅ Token system (sardines, scallops, water)
- ✅ Card system (boats, upgrades, special cards)
- ✅ Drag-and-drop canvas interface
- ✅ Sea bag drawing mechanic
- ✅ Market selling (simplified for now)
- ✅ Boat purchasing system
- ✅ Upgrade purchasing system
- ✅ Fish spawning mechanics
- ✅ Upkeep payment
- ✅ Round progression (7 rounds)
- ✅ Win/lose condition checking
- ✅ Save/load game state

## How to Play

### 1. Start the Game
- Click "Play Conservas" from the main menu
- The game automatically sets up:
  - Sea bag with 5 sardines, 5 scallops, 10 water
  - Your starting boat (El Dorado)
  - Open Water card
  - 3 boats in market
  - 3 upgrades in market
  - Starting money: €10

### 2. At Sea Phase
- Click "Draw 5 Tokens" to draw from the sea bag
- Tokens appear on the canvas - you can drag them
- Place tokens on your boats or open water card
- Each boat has a "catch size" (how many tokens go on the boat)
- Remaining tokens go to "Deep Sea" (under the boat/on open water)
- Continue until all boats and open water have tokens

### 3. On Land Phase
- **Sell fish to market**: Drag fish tokens to the market grid (simplified - will be enhanced)
- **Buy boats**: Drag boat cards from market to your boats area (costs money)
- **Buy upgrades**: Drag upgrade cards from market to your upgrades area (costs fish tokens)
- Click "End of Day →" when done

### 4. End of Day Phase
- Click "Process End of Day"
- System automatically:
  - Pays upkeep for your boats
  - Spawns new fish (for every fish token after the first, add 1 more)
  - Moves all tokens back to sea bag
  - Shuffles sea bag
  - Advances to next round
- Repeat At Sea phase

### 5. Game Over
- After 7 rounds, check win condition
- Win if you have: **€40 + 4 sardines + 4 scallops in sea**

## UI Overview

### Left Sidebar
- **Game Info Panel**: Shows round, money, current phase
- **Phase Controls**: Context-sensitive buttons for current phase
- **Save Game button**: Saves to localStorage
- **Exit Game button**: Return to menu

### Main Canvas
- **Sea Bag**: Brown bag icon (top-left) - shows token count
- **General Supply**: Unused tokens
- **Boat Market**: 3 available boats to purchase
- **Upgrade Market**: 3 available upgrades to purchase
- **Your Boats**: Your purchased boats
- **Your Upgrades**: Your purchased upgrades
- **Game Areas**: Dashed rectangles for organizing components

## Current Limitations (To Be Fixed)

1. **Market Grid**: Currently simplified - need to implement the actual January market grid with specific pricing
2. **Token Placement**: Manual placement on boats (could be auto-placed based on catch size)
3. **Upgrade Effects**: Defined but not fully implemented yet
4. **Boat Effects**: Currently just catch size and upkeep
5. **Animations**: No smooth transitions yet
6. **Sound Effects**: Not implemented
7. **Tutorial**: No in-game tutorial yet

## Known Issues

1. **TypeScript Warnings**: Some unused variable warnings (don't affect gameplay)
2. **Token Colors**: Using default colors - custom images can be added later
3. **Container Click Actions**: Drawing from bag happens via button, not clicking the bag itself

## Testing Checklist

- [ ] Start new game (setup works correctly)
- [ ] Draw tokens (5 tokens appear)
- [ ] Drag tokens around canvas
- [ ] Flip tokens (double-click sardine/scallop)
- [ ] Place tokens on boats
- [ ] Advance to On Land phase
- [ ] Buy a boat (if you have money)
- [ ] Buy an upgrade (if you have fish)
- [ ] Process End of Day
- [ ] Verify fish spawning (check sea bag count increases)
- [ ] Play through multiple rounds
- [ ] Check win condition after round 7
- [ ] Save game (click Save button)
- [ ] Reload page and check if state persists

## Debug Features

- **Check Win (Debug)** button: Test win condition at any time
- Browser console: Check for errors or warnings
- React DevTools: Inspect component state

## Next Steps for Development

See `DEVELOPMENT_PHASES.md` for the full roadmap. Upcoming priorities:

1. **Market Grid Implementation**: Proper January market with pricing
2. **Upgrade Card Effects**: Make upgrades actually work
3. **Auto-placement**: Smart token placement on boats
4. **Animations**: Smooth token movements
5. **Additional Months**: February-December scenarios
6. **Polish**: Better visuals, sounds, tutorial

## Reporting Issues

If you find bugs during testing:
1. Note the phase you were in
2. What action you took
3. What you expected vs what happened
4. Check browser console for errors

## Development Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

## File Structure Reference

```
src/
├── components/
│   ├── GameCanvas.tsx          # Main canvas component
│   ├── GameInfoPanel.tsx       # Shows game stats
│   ├── PhaseControls.tsx       # Phase action buttons
│   └── renderers/              # Component renderers
│       ├── TokenRenderer.tsx
│       ├── CardRenderer.tsx
│       ├── ContainerRenderer.tsx
│       └── AreaRenderer.tsx
├── games/
│   └── conservas/
│       └── ConservasGame.ts    # Game logic
├── utils/
│   ├── actionExecutor.ts       # Action system
│   ├── componentUtils.ts       # Component helpers
│   ├── gameHelpers.ts          # Game logic helpers
│   ├── gameLoader.ts           # JSON game loader
│   └── stateSerializer.ts      # Save/load
└── stores/
    └── gameStore.ts            # Zustand state store

public/
└── games/
    └── conservas-january.json  # Game definition
```

---

**Happy Testing!** 🎮🐟
