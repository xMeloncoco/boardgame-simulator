// Core game component types

export type ComponentType = 'token' | 'card' | 'board' | 'container' | 'area'

export interface BaseComponent {
  id: string
  type: ComponentType
  name: string
  position?: { x: number; y: number }
  properties: Record<string, unknown>
}

export interface Token extends BaseComponent {
  type: 'token'
  tokenType: string
  value?: number
  image?: string
  flippable: boolean
  currentSide: 'front' | 'back'
}

export interface Card extends BaseComponent {
  type: 'card'
  cardType: string
  size: { width: number; height: number }
  frontImage?: string
  backImage?: string
  faceUp: boolean
  properties: Record<string, unknown>
}

export interface Container extends BaseComponent {
  type: 'container'
  containerType: 'bag' | 'deck' | 'hand' | 'pile' | 'discard'
  contents: string[] // Array of component IDs
  shuffled: boolean
  visible: boolean
}

export interface Area extends BaseComponent {
  type: 'area'
  bounds: {
    x: number
    y: number
    width: number
    height: number
  }
  acceptsTypes: ComponentType[]
}

export type GameComponent = Token | Card | Container | Area

// Game state
export interface GameState {
  gameId: string
  gameName: string
  components: Map<string, GameComponent>
  variables: Map<string, number | string | boolean>
  currentPhase: string
  actionHistory: GameAction[]
}

// Actions
export type ActionType =
  | 'CREATE_TOKEN'
  | 'CREATE_CARD'
  | 'MOVE_COMPONENT'
  | 'FLIP_COMPONENT'
  | 'REMOVE_COMPONENT'
  | 'SHUFFLE_CONTAINER'
  | 'DRAW_FROM_CONTAINER'
  | 'SET_VARIABLE'
  | 'CHANGE_PHASE'

export interface GameAction {
  type: ActionType
  payload: unknown
  timestamp: number
}
