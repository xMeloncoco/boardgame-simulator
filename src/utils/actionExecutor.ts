import { GameState, GameAction, GameComponent, Token, Card, Container } from '@/types/game'
import {
  createToken,
  createCard,
  createContainer,
  flipToken,
  flipCard,
  addToContainer,
  removeFromContainer,
  shuffleContainer,
  drawFromContainer,
  moveComponent,
} from './componentUtils'

export interface CreateTokenAction {
  type: 'CREATE_TOKEN'
  payload: {
    tokenType: string
    properties?: Record<string, unknown>
    position?: { x: number; y: number }
    containerId?: string
  }
}

export interface CreateCardAction {
  type: 'CREATE_CARD'
  payload: {
    cardType: string
    size: { width: number; height: number }
    properties?: Record<string, unknown>
    position?: { x: number; y: number }
    containerId?: string
  }
}

export interface MoveComponentAction {
  type: 'MOVE_COMPONENT'
  payload: {
    componentId: string
    position?: { x: number; y: number }
    containerId?: string
    fromContainerId?: string
  }
}

export interface FlipComponentAction {
  type: 'FLIP_COMPONENT'
  payload: {
    componentId: string
  }
}

export interface RemoveComponentAction {
  type: 'REMOVE_COMPONENT'
  payload: {
    componentId: string
    fromContainerId?: string
  }
}

export interface ShuffleContainerAction {
  type: 'SHUFFLE_CONTAINER'
  payload: {
    containerId: string
  }
}

export interface DrawFromContainerAction {
  type: 'DRAW_FROM_CONTAINER'
  payload: {
    containerId: string
    count: number
    toContainerId?: string
    toPosition?: { x: number; y: number }
  }
}

export interface SetVariableAction {
  type: 'SET_VARIABLE'
  payload: {
    name: string
    value: number | string | boolean
  }
}

export interface ChangePhaseAction {
  type: 'CHANGE_PHASE'
  payload: {
    phase: string
  }
}

export type GameActionPayload =
  | CreateTokenAction
  | CreateCardAction
  | MoveComponentAction
  | FlipComponentAction
  | RemoveComponentAction
  | ShuffleContainerAction
  | DrawFromContainerAction
  | SetVariableAction
  | ChangePhaseAction

export const executeAction = (state: GameState, action: GameActionPayload): GameState => {
  const newComponents = new Map(state.components)
  const newVariables = new Map(state.variables)

  switch (action.type) {
    case 'CREATE_TOKEN': {
      const token = createToken(action.payload.tokenType, action.payload.properties || {})
      if (action.payload.position) {
        token.position = action.payload.position
      }
      newComponents.set(token.id, token)

      if (action.payload.containerId) {
        const container = newComponents.get(action.payload.containerId) as Container
        if (container) {
          newComponents.set(container.id, addToContainer(container, token.id))
        }
      }
      break
    }

    case 'CREATE_CARD': {
      const card = createCard(
        action.payload.cardType,
        action.payload.size,
        action.payload.properties || {}
      )
      if (action.payload.position) {
        card.position = action.payload.position
      }
      newComponents.set(card.id, card)

      if (action.payload.containerId) {
        const container = newComponents.get(action.payload.containerId) as Container
        if (container) {
          newComponents.set(container.id, addToContainer(container, card.id))
        }
      }
      break
    }

    case 'MOVE_COMPONENT': {
      const component = newComponents.get(action.payload.componentId)
      if (!component) break

      // Remove from old container if specified
      if (action.payload.fromContainerId) {
        const fromContainer = newComponents.get(action.payload.fromContainerId) as Container
        if (fromContainer) {
          newComponents.set(
            fromContainer.id,
            removeFromContainer(fromContainer, component.id)
          )
        }
      }

      // Update position if specified
      if (action.payload.position) {
        newComponents.set(component.id, moveComponent(component, action.payload.position))
      }

      // Add to new container if specified
      if (action.payload.containerId) {
        const toContainer = newComponents.get(action.payload.containerId) as Container
        if (toContainer) {
          newComponents.set(toContainer.id, addToContainer(toContainer, component.id))
        }
      }
      break
    }

    case 'FLIP_COMPONENT': {
      const component = newComponents.get(action.payload.componentId)
      if (!component) break

      if (component.type === 'token') {
        newComponents.set(component.id, flipToken(component as Token))
      } else if (component.type === 'card') {
        newComponents.set(component.id, flipCard(component as Card))
      }
      break
    }

    case 'REMOVE_COMPONENT': {
      const component = newComponents.get(action.payload.componentId)
      if (!component) break

      // Remove from container if specified
      if (action.payload.fromContainerId) {
        const container = newComponents.get(action.payload.fromContainerId) as Container
        if (container) {
          newComponents.set(
            container.id,
            removeFromContainer(container, component.id)
          )
        }
      }

      newComponents.delete(action.payload.componentId)
      break
    }

    case 'SHUFFLE_CONTAINER': {
      const container = newComponents.get(action.payload.containerId) as Container
      if (container) {
        newComponents.set(container.id, shuffleContainer(container))
      }
      break
    }

    case 'DRAW_FROM_CONTAINER': {
      const container = newComponents.get(action.payload.containerId) as Container
      if (!container) break

      const { container: updatedContainer, drawn } = drawFromContainer(
        container,
        action.payload.count
      )
      newComponents.set(container.id, updatedContainer)

      // Move drawn components to target container or position
      drawn.forEach((componentId) => {
        const component = newComponents.get(componentId)
        if (!component) return

        if (action.payload.toContainerId) {
          const toContainer = newComponents.get(action.payload.toContainerId) as Container
          if (toContainer) {
            newComponents.set(toContainer.id, addToContainer(toContainer, componentId))
          }
        } else if (action.payload.toPosition) {
          newComponents.set(componentId, moveComponent(component, action.payload.toPosition))
        }
      })
      break
    }

    case 'SET_VARIABLE': {
      newVariables.set(action.payload.name, action.payload.value)
      break
    }

    case 'CHANGE_PHASE': {
      return {
        ...state,
        currentPhase: action.payload.phase,
        actionHistory: [
          ...state.actionHistory,
          { type: 'CHANGE_PHASE', payload: action.payload, timestamp: Date.now() },
        ],
      }
    }
  }

  return {
    ...state,
    components: newComponents,
    variables: newVariables,
    actionHistory: [
      ...state.actionHistory,
      { type: action.type, payload: action.payload, timestamp: Date.now() },
    ],
  }
}

// Batch execute multiple actions
export const executeActions = (
  state: GameState,
  actions: GameActionPayload[]
): GameState => {
  return actions.reduce((currentState, action) => executeAction(currentState, action), state)
}
