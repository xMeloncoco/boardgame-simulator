// Game definition schema for JSON-based game configurations

export interface GameDefinition {
  gameInfo: GameInfo
  components: ComponentDefinitions
  variables: VariableDefinitions
  phases: PhaseDefinition[]
  setup: SetupInstruction[]
  winConditions: Condition[]
  loseConditions: Condition[]
}

export interface GameInfo {
  name: string
  version: string
  description?: string
  playerCount: {
    min: number
    max: number
  }
}

export interface ComponentDefinitions {
  tokens?: TokenDefinition[]
  cards?: CardDefinition[]
  boards?: BoardDefinition[]
  containers?: ContainerDefinition[]
  areas?: AreaDefinition[]
}

export interface TokenDefinition {
  id: string
  name: string
  tokenType: string
  count: number
  image?: string
  backImage?: string
  flippable: boolean
  properties?: Record<string, unknown>
}

export interface CardDefinition {
  id: string
  name: string
  cardType: string
  count: number
  size: { width: number; height: number }
  frontImage?: string
  backImage?: string
  properties?: Record<string, unknown>
}

export interface BoardDefinition {
  id: string
  name: string
  image?: string
  width: number
  height: number
}

export interface ContainerDefinition {
  id: string
  name: string
  containerType: 'bag' | 'deck' | 'hand' | 'pile' | 'discard'
  initialContents: string[]
  position?: { x: number; y: number }
  visible: boolean
}

export interface AreaDefinition {
  id: string
  name: string
  bounds: {
    x: number
    y: number
    width: number
    height: number
  }
  acceptsTypes: string[]
}

export interface VariableDefinitions {
  [key: string]: {
    initial: number | string | boolean
    type: 'number' | 'string' | 'boolean'
  }
}

export interface PhaseDefinition {
  id: string
  name: string
  description?: string
  nextPhase?: string
  onEnter?: string // JavaScript function name
  onExit?: string // JavaScript function name
  availableActions?: string[]
}

export interface SetupInstruction {
  action: string
  parameters: Record<string, unknown>
}

export interface Condition {
  description: string
  check: string // JavaScript expression or function name
}
