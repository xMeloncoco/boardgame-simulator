import { GameState, Token, Card, Container } from '@/types/game'
import {
  getTokensByType,
  getCardsInContainer,
  countComponentsInContainer,
  shuffleContainer,
  drawFromContainer,
} from './componentUtils'
import { GameActionPayload } from './actionExecutor'

/**
 * Game Helper Library
 *
 * This provides high-level helper functions for game scripts to use.
 * Scripts can access these through the GameContext.
 */

export interface GameContext {
  state: GameState
  dispatch: (action: GameActionPayload) => void
  helpers: typeof GameHelpers
}

export const GameHelpers = {
  // ===== QUERY HELPERS =====

  /**
   * Get all components from a container
   */
  getContainerContents(state: GameState, containerId: string) {
    const container = state.components.get(containerId) as Container | undefined
    return container?.contents || []
  },

  /**
   * Get all tokens of a specific type
   */
  getTokensByType(state: GameState, tokenType: string): Token[] {
    return getTokensByType(state.components, tokenType)
  },

  /**
   * Get cards in a container
   */
  getCardsInContainer(state: GameState, containerId: string): Card[] {
    return getCardsInContainer(state.components, containerId)
  },

  /**
   * Count items in container with optional filter
   */
  countInContainer(
    state: GameState,
    containerId: string,
    tokenType?: string
  ): number {
    if (!tokenType) {
      return countComponentsInContainer(state.components, containerId)
    }
    return countComponentsInContainer(state.components, containerId, (c) => {
      if (c.type === 'token') {
        return (c as Token).tokenType === tokenType
      }
      return false
    })
  },

  /**
   * Get variable value
   */
  getVariable(state: GameState, name: string): number | string | boolean | undefined {
    return state.variables.get(name)
  },

  /**
   * Get numeric variable (with default)
   */
  getNumericVariable(state: GameState, name: string, defaultValue: number = 0): number {
    const value = state.variables.get(name)
    return typeof value === 'number' ? value : defaultValue
  },

  // ===== ACTION HELPERS =====

  /**
   * Create a token and optionally add to container
   */
  createToken(
    tokenType: string,
    properties?: Record<string, unknown>,
    containerId?: string,
    position?: { x: number; y: number }
  ): GameActionPayload {
    return {
      type: 'CREATE_TOKEN',
      payload: {
        tokenType,
        properties,
        containerId,
        position,
      },
    }
  },

  /**
   * Move component to container
   */
  moveToContainer(
    componentId: string,
    toContainerId: string,
    fromContainerId?: string
  ): GameActionPayload {
    return {
      type: 'MOVE_COMPONENT',
      payload: {
        componentId,
        containerId: toContainerId,
        fromContainerId,
      },
    }
  },

  /**
   * Draw tokens from bag/container
   */
  drawFromBag(
    containerId: string,
    count: number,
    toPosition?: { x: number; y: number }
  ): GameActionPayload {
    return {
      type: 'DRAW_FROM_CONTAINER',
      payload: {
        containerId,
        count,
        toPosition,
      },
    }
  },

  /**
   * Shuffle container
   */
  shuffleContainer(containerId: string): GameActionPayload {
    return {
      type: 'SHUFFLE_CONTAINER',
      payload: { containerId },
    }
  },

  /**
   * Set variable value
   */
  setVariable(name: string, value: number | string | boolean): GameActionPayload {
    return {
      type: 'SET_VARIABLE',
      payload: { name, value },
    }
  },

  /**
   * Increment numeric variable
   */
  incrementVariable(state: GameState, name: string, amount: number = 1): GameActionPayload {
    const current = this.getNumericVariable(state, name)
    return this.setVariable(name, current + amount)
  },

  /**
   * Decrement numeric variable
   */
  decrementVariable(state: GameState, name: string, amount: number = 1): GameActionPayload {
    const current = this.getNumericVariable(state, name)
    return this.setVariable(name, current - amount)
  },

  /**
   * Change phase
   */
  changePhase(phase: string): GameActionPayload {
    return {
      type: 'CHANGE_PHASE',
      payload: { phase },
    }
  },

  // ===== CONSERVAS-SPECIFIC HELPERS =====

  /**
   * Pay money (reduce money variable)
   */
  payMoney(state: GameState, amount: number): GameActionPayload {
    const current = this.getNumericVariable(state, 'money')
    return this.setVariable('money', Math.max(0, current - amount))
  },

  /**
   * Earn money (increase money variable)
   */
  earnMoney(state: GameState, amount: number): GameActionPayload {
    const current = this.getNumericVariable(state, 'money')
    return this.setVariable('money', current + amount)
  },

  /**
   * Advance round
   */
  advanceRound(state: GameState): GameActionPayload {
    const current = this.getNumericVariable(state, 'round')
    return this.setVariable('round', current + 1)
  },

  /**
   * Spawn fish tokens (Conservas spawning mechanic)
   * For every fish token (not counting the first), add 1 more token
   */
  spawnFish(
    state: GameState,
    containerId: string,
    fishType: string
  ): GameActionPayload[] {
    const count = this.countInContainer(state, containerId, fishType)
    if (count < 2) return []

    const toSpawn = count - 1
    const actions: GameActionPayload[] = []

    for (let i = 0; i < toSpawn; i++) {
      actions.push(
        this.createToken(fishType, { flippable: true }, containerId)
      )
    }

    return actions
  },

  // ===== CONDITION CHECKERS =====

  /**
   * Check if player has enough money
   */
  hasEnoughMoney(state: GameState, amount: number): boolean {
    return this.getNumericVariable(state, 'money') >= amount
  },

  /**
   * Check if container has minimum items
   */
  hasMinimumInContainer(
    state: GameState,
    containerId: string,
    minimum: number,
    tokenType?: string
  ): boolean {
    return this.countInContainer(state, containerId, tokenType) >= minimum
  },

  /**
   * Check win condition (for Conservas)
   */
  checkWinCondition(
    state: GameState,
    requiredMoney: number,
    requiredFish: Record<string, number>
  ): boolean {
    // Check money
    if (!this.hasEnoughMoney(state, requiredMoney)) {
      return false
    }

    // Check fish in sea bag
    const seaBagId = Array.from(state.components.values()).find(
      (c) => c.type === 'container' && c.name === 'Sea Bag'
    )?.id

    if (!seaBagId) return false

    // Check each fish type requirement
    for (const [fishType, required] of Object.entries(requiredFish)) {
      if (!this.hasMinimumInContainer(state, seaBagId, required, fishType)) {
        return false
      }
    }

    return true
  },
}

/**
 * Create a game context for script execution
 */
export function createGameContext(
  state: GameState,
  dispatch: (action: GameActionPayload) => void
): GameContext {
  return {
    state,
    dispatch,
    helpers: GameHelpers,
  }
}
