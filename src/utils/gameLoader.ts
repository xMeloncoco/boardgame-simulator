import { GameDefinition, ComponentDefinitions } from '@/types/gameDefinition'
import { GameState, Token, Card, Container, Area } from '@/types/game'
import { createToken, createCard, createContainer, createArea, generateId } from './componentUtils'

export class GameLoader {
  static async loadFromJSON(json: string): Promise<GameDefinition> {
    try {
      const definition = JSON.parse(json) as GameDefinition
      return this.validateDefinition(definition)
    } catch (error) {
      console.error('Failed to load game definition:', error)
      throw new Error('Invalid game definition JSON')
    }
  }

  static async loadFromFile(file: File): Promise<GameDefinition> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const json = e.target?.result as string
          const definition = await this.loadFromJSON(json)
          resolve(definition)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }

  static validateDefinition(definition: GameDefinition): GameDefinition {
    if (!definition.gameInfo || !definition.gameInfo.name) {
      throw new Error('Game definition must include gameInfo with name')
    }
    if (!definition.components) {
      throw new Error('Game definition must include components')
    }
    return definition
  }

  static initializeGameFromDefinition(definition: GameDefinition): GameState {
    const gameState: GameState = {
      gameId: generateId(),
      gameName: definition.gameInfo.name,
      components: new Map(),
      variables: new Map(),
      currentPhase: definition.phases[0]?.id || 'setup',
      actionHistory: [],
    }

    // Initialize variables
    if (definition.variables) {
      Object.entries(definition.variables).forEach(([name, config]) => {
        gameState.variables.set(name, config.initial)
      })
    }

    // Create components from definitions
    this.createComponentsFromDefinition(gameState, definition.components)

    return gameState
  }

  private static createComponentsFromDefinition(
    gameState: GameState,
    componentDefs: ComponentDefinitions
  ): void {
    // Create tokens
    if (componentDefs.tokens) {
      componentDefs.tokens.forEach((tokenDef) => {
        for (let i = 0; i < tokenDef.count; i++) {
          const token = createToken(tokenDef.tokenType, {
            ...tokenDef.properties,
            image: tokenDef.image,
            backImage: tokenDef.backImage,
            flippable: tokenDef.flippable,
          })
          gameState.components.set(token.id, token)
        }
      })
    }

    // Create cards
    if (componentDefs.cards) {
      componentDefs.cards.forEach((cardDef) => {
        for (let i = 0; i < cardDef.count; i++) {
          const card = createCard(cardDef.cardType, cardDef.size, {
            ...cardDef.properties,
            frontImage: cardDef.frontImage,
            backImage: cardDef.backImage,
          })
          gameState.components.set(card.id, card)
        }
      })
    }

    // Create containers
    if (componentDefs.containers) {
      componentDefs.containers.forEach((containerDef) => {
        const container = createContainer(
          containerDef.containerType,
          containerDef.name,
          {
            visible: containerDef.visible,
          }
        )

        if (containerDef.position) {
          container.position = containerDef.position
        }

        // Add initial contents if specified
        if (containerDef.initialContents && containerDef.initialContents.length > 0) {
          container.contents = [...containerDef.initialContents]
        }

        gameState.components.set(container.id, container)
      })
    }

    // Create areas
    if (componentDefs.areas) {
      componentDefs.areas.forEach((areaDef) => {
        const area = createArea(areaDef.name, areaDef.bounds, areaDef.acceptsTypes)
        gameState.components.set(area.id, area)
      })
    }
  }

  static executeSetupInstructions(
    gameState: GameState,
    definition: GameDefinition,
    scriptContext?: Record<string, unknown>
  ): GameState {
    // Execute setup instructions
    if (definition.setup && definition.setup.length > 0) {
      // This would call into the script engine
      // For now, we'll handle basic setup actions
      definition.setup.forEach((instruction) => {
        // Setup logic would go here
        console.log('Setup instruction:', instruction)
      })
    }

    return gameState
  }
}

// Helper to create a complete game instance
export async function createGameFromDefinition(
  definition: GameDefinition
): Promise<GameState> {
  const gameState = GameLoader.initializeGameFromDefinition(definition)
  return GameLoader.executeSetupInstructions(gameState, definition)
}

// Helper to load and create game from JSON file
export async function loadGameFromFile(file: File): Promise<GameState> {
  const definition = await GameLoader.loadFromFile(file)
  return createGameFromDefinition(definition)
}
