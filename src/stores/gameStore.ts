import { create } from 'zustand'
import { GameState, GameComponent } from '@/types/game'
import { executeAction, GameActionPayload } from '@/utils/actionExecutor'
import {
  saveGameToLocalStorage,
  loadGameFromLocalStorage,
  serializeGameState,
} from '@/utils/stateSerializer'
import { generateId } from '@/utils/componentUtils'

interface GameStore extends GameState {
  // Core actions
  dispatch: (action: GameActionPayload) => void
  batchDispatch: (actions: GameActionPayload[]) => void

  // Legacy component actions (kept for convenience)
  addComponent: (component: GameComponent) => void
  removeComponent: (id: string) => void
  updateComponent: (id: string, updates: Partial<GameComponent>) => void
  setVariable: (name: string, value: number | string | boolean) => void
  setPhase: (phase: string) => void

  // Game management
  initializeGame: (gameId: string, gameName: string) => void
  resetGame: () => void
  saveGame: (slotName?: string) => void
  loadGame: (slotName?: string) => boolean
  exportState: () => string

  // Query helpers
  getComponent: (id: string) => GameComponent | undefined
  getVariable: (name: string) => number | string | boolean | undefined
}

const initialState: GameState = {
  gameId: '',
  gameName: '',
  components: new Map(),
  variables: new Map(),
  currentPhase: 'setup',
  actionHistory: [],
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  // Main dispatch function using action executor
  dispatch: (action) => {
    const currentState = get()
    const newState = executeAction(currentState, action)
    set({
      gameId: newState.gameId,
      gameName: newState.gameName,
      components: newState.components,
      variables: newState.variables,
      currentPhase: newState.currentPhase,
      actionHistory: newState.actionHistory,
    })
  },

  batchDispatch: (actions) => {
    const currentState = get()
    const newState = actions.reduce<GameState>((state, action) => executeAction(state, action), currentState)
    set({
      gameId: newState.gameId,
      gameName: newState.gameName,
      components: newState.components,
      variables: newState.variables,
      currentPhase: newState.currentPhase,
      actionHistory: newState.actionHistory,
    })
  },

  // Legacy convenience methods
  addComponent: (component) =>
    set((state) => {
      const newComponents = new Map(state.components)
      newComponents.set(component.id, component)
      return { components: newComponents }
    }),

  removeComponent: (id) =>
    get().dispatch({
      type: 'REMOVE_COMPONENT',
      payload: { componentId: id },
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
    get().dispatch({
      type: 'SET_VARIABLE',
      payload: { name, value },
    }),

  setPhase: (phase) =>
    get().dispatch({
      type: 'CHANGE_PHASE',
      payload: { phase },
    }),

  // Game management
  initializeGame: (gameId, gameName) =>
    set({
      ...initialState,
      gameId: gameId || generateId(),
      gameName,
      components: new Map(),
      variables: new Map(),
      currentPhase: 'setup',
      actionHistory: [],
    }),

  resetGame: () => set(initialState),

  saveGame: (slotName = 'autosave') => {
    const state = get()
    saveGameToLocalStorage(state, slotName)
  },

  loadGame: (slotName = 'autosave') => {
    const loadedState = loadGameFromLocalStorage(slotName)
    if (loadedState) {
      set(loadedState)
      return true
    }
    return false
  },

  exportState: () => {
    const state = get()
    return JSON.stringify(serializeGameState(state), null, 2)
  },

  // Query helpers
  getComponent: (id) => get().components.get(id),

  getVariable: (name) => get().variables.get(name),
}))
