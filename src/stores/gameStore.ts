import { create } from 'zustand'
import { GameState, GameComponent, GameAction } from '@/types/game'

interface GameStore extends GameState {
  // Actions
  addComponent: (component: GameComponent) => void
  removeComponent: (id: string) => void
  updateComponent: (id: string, updates: Partial<GameComponent>) => void
  setVariable: (name: string, value: number | string | boolean) => void
  setPhase: (phase: string) => void
  addAction: (action: GameAction) => void
  resetGame: () => void
}

const initialState: GameState = {
  gameId: '',
  gameName: '',
  components: new Map(),
  variables: new Map(),
  currentPhase: 'setup',
  actionHistory: [],
}

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  addComponent: (component) =>
    set((state) => {
      const newComponents = new Map(state.components)
      newComponents.set(component.id, component)
      return { components: newComponents }
    }),

  removeComponent: (id) =>
    set((state) => {
      const newComponents = new Map(state.components)
      newComponents.delete(id)
      return { components: newComponents }
    }),

  updateComponent: (id, updates) =>
    set((state) => {
      const newComponents = new Map(state.components)
      const component = newComponents.get(id)
      if (component) {
        newComponents.set(id, { ...component, ...updates })
      }
      return { components: newComponents }
    }),

  setVariable: (name, value) =>
    set((state) => {
      const newVariables = new Map(state.variables)
      newVariables.set(name, value)
      return { variables: newVariables }
    }),

  setPhase: (phase) => set({ currentPhase: phase }),

  addAction: (action) =>
    set((state) => ({
      actionHistory: [...state.actionHistory, action],
    })),

  resetGame: () => set(initialState),
}))
