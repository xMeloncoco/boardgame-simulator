import { GameComponent, Token, Card, Container, Area } from '@/types/game'

// Utility to generate unique IDs
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Token utilities
export const createToken = (
  tokenType: string,
  properties: Record<string, unknown> = {}
): Token => {
  return {
    id: generateId(),
    type: 'token',
    name: tokenType,
    tokenType,
    flippable: properties.flippable as boolean || false,
    currentSide: 'front',
    image: properties.image as string,
    value: properties.value as number,
    properties,
  }
}

export const flipToken = (token: Token): Token => {
  if (!token.flippable) return token
  return {
    ...token,
    currentSide: token.currentSide === 'front' ? 'back' : 'front',
  }
}

// Card utilities
export const createCard = (
  cardType: string,
  size: { width: number; height: number },
  properties: Record<string, unknown> = {}
): Card => {
  return {
    id: generateId(),
    type: 'card',
    name: cardType,
    cardType,
    size,
    frontImage: properties.frontImage as string,
    backImage: properties.backImage as string,
    faceUp: properties.faceUp as boolean ?? true,
    properties,
  }
}

export const flipCard = (card: Card): Card => {
  return {
    ...card,
    faceUp: !card.faceUp,
  }
}

// Container utilities
export const createContainer = (
  containerType: 'bag' | 'deck' | 'hand' | 'pile' | 'discard',
  name: string,
  properties: Record<string, unknown> = {}
): Container => {
  return {
    id: generateId(),
    type: 'container',
    name,
    containerType,
    contents: [],
    shuffled: false,
    visible: properties.visible as boolean ?? false,
    properties,
  }
}

export const addToContainer = (container: Container, componentId: string): Container => {
  return {
    ...container,
    contents: [...container.contents, componentId],
  }
}

export const removeFromContainer = (container: Container, componentId: string): Container => {
  return {
    ...container,
    contents: container.contents.filter((id) => id !== componentId),
  }
}

export const shuffleContainer = (container: Container): Container => {
  const shuffled = [...container.contents]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return {
    ...container,
    contents: shuffled,
    shuffled: true,
  }
}

export const drawFromContainer = (
  container: Container,
  count: number = 1
): { container: Container; drawn: string[] } => {
  const drawn = container.contents.slice(0, count)
  const remaining = container.contents.slice(count)
  return {
    container: { ...container, contents: remaining },
    drawn,
  }
}

// Area utilities
export const createArea = (
  name: string,
  bounds: { x: number; y: number; width: number; height: number },
  acceptsTypes: string[] = []
): Area => {
  return {
    id: generateId(),
    type: 'area',
    name,
    bounds,
    acceptsTypes: acceptsTypes as ('token' | 'card' | 'board' | 'container' | 'area')[],
    properties: {},
  }
}

export const isInArea = (
  component: GameComponent,
  area: Area
): boolean => {
  if (!component.position) return false
  const { x, y } = component.position
  const { x: ax, y: ay, width, height } = area.bounds
  return x >= ax && x <= ax + width && y >= ay && y <= ay + height
}

// Component positioning
export const moveComponent = <T extends GameComponent>(
  component: T,
  position: { x: number; y: number }
): T => {
  return {
    ...component,
    position,
  }
}

// Generic component utilities
export const findComponentById = (
  components: Map<string, GameComponent>,
  id: string
): GameComponent | undefined => {
  return components.get(id)
}

export const getComponentsByType = (
  components: Map<string, GameComponent>,
  type: GameComponent['type']
): GameComponent[] => {
  return Array.from(components.values()).filter((c) => c.type === type)
}

export const getTokensByType = (
  components: Map<string, GameComponent>,
  tokenType: string
): Token[] => {
  return Array.from(components.values()).filter(
    (c): c is Token => c.type === 'token' && c.tokenType === tokenType
  )
}

export const getCardsInContainer = (
  components: Map<string, GameComponent>,
  containerId: string
): Card[] => {
  const container = components.get(containerId) as Container | undefined
  if (!container || container.type !== 'container') return []

  return container.contents
    .map((id) => components.get(id))
    .filter((c): c is Card => c !== undefined && c.type === 'card')
}

export const countComponentsInContainer = (
  components: Map<string, GameComponent>,
  containerId: string,
  filter?: (component: GameComponent) => boolean
): number => {
  const container = components.get(containerId) as Container | undefined
  if (!container || container.type !== 'container') return 0

  const items = container.contents
    .map((id) => components.get(id))
    .filter((c): c is GameComponent => c !== undefined)

  return filter ? items.filter(filter).length : items.length
}
