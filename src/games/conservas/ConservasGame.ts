import { GameState, Token, Card, Container } from '@/types/game'
import { GameDefinition } from '@/types/gameDefinition'
import { GameActionPayload } from '@/utils/actionExecutor'
import { GameHelpers } from '@/utils/gameHelpers'
import { shuffleContainer, generateId } from '@/utils/componentUtils'

export class ConservasGame {
  private definition: GameDefinition
  private state: GameState

  constructor(definition: GameDefinition, initialState: GameState) {
    this.definition = definition
    this.state = initialState
  }

  /**
   * Setup the game - load sea bag, deal cards, etc.
   */
  setupGame(): GameActionPayload[] {
    const actions: GameActionPayload[] = []

    // Get container IDs
    const seaBagId = this.getContainerId('Sea Bag')
    const generalSupplyId = this.getContainerId('General Supply')
    const boatDeckId = this.getContainerId('Boat Deck')
    const upgradeDeckId = this.getContainerId('Upgrade Deck')
    const boatMarketId = this.getContainerId('Boat Market')
    const upgradeMarketId = this.getContainerId('Upgrade Market')
    const playerBoatsId = this.getContainerId('My Boats')

    if (!seaBagId || !generalSupplyId || !boatDeckId || !upgradeDeckId) {
      console.error('Missing required containers')
      return actions
    }

    // Load sea bag (January: 5 sardines, 5 scallops, 10 water)
    const sardineTokens = this.getTokensByType('sardine')
    const scallopTokens = this.getTokensByType('scallop')
    const waterTokens = this.getTokensByType('water')

    // Add 5 sardines to sea bag
    sardineTokens.slice(0, 5).forEach((token) => {
      actions.push({
        type: 'MOVE_COMPONENT',
        payload: {
          componentId: token.id,
          containerId: seaBagId,
        },
      })
    })

    // Add 5 scallops to sea bag
    scallopTokens.slice(0, 5).forEach((token) => {
      actions.push({
        type: 'MOVE_COMPONENT',
        payload: {
          componentId: token.id,
          containerId: seaBagId,
        },
      })
    })

    // Add 10 water to sea bag
    waterTokens.slice(0, 10).forEach((token) => {
      actions.push({
        type: 'MOVE_COMPONENT',
        payload: {
          componentId: token.id,
          containerId: seaBagId,
        },
      })
    })

    // Remaining tokens go to general supply
    sardineTokens.slice(5).forEach((token) => {
      actions.push({
        type: 'MOVE_COMPONENT',
        payload: {
          componentId: token.id,
          containerId: generalSupplyId,
        },
      })
    })

    scallopTokens.slice(5).forEach((token) => {
      actions.push({
        type: 'MOVE_COMPONENT',
        payload: {
          componentId: token.id,
          containerId: generalSupplyId,
        },
      })
    })

    waterTokens.slice(10).forEach((token) => {
      actions.push({
        type: 'MOVE_COMPONENT',
        payload: {
          componentId: token.id,
          containerId: generalSupplyId,
        },
      })
    })

    // Shuffle sea bag
    actions.push(GameHelpers.shuffleContainer(seaBagId))

    // Setup boat deck (put boats in deck except El Dorado)
    const boats = this.getCardsByType('boat')
    boats.forEach((boat) => {
      if (boat.name === 'El Dorado' && playerBoatsId) {
        // Give El Dorado to player
        actions.push({
          type: 'MOVE_COMPONENT',
          payload: {
            componentId: boat.id,
            containerId: playerBoatsId,
          },
        })
      } else {
        actions.push({
          type: 'MOVE_COMPONENT',
          payload: {
            componentId: boat.id,
            containerId: boatDeckId,
          },
        })
      }
    })

    // Setup upgrade deck
    const upgrades = this.getCardsByType('upgrade')
    upgrades.forEach((upgrade) => {
      actions.push({
        type: 'MOVE_COMPONENT',
        payload: {
          componentId: upgrade.id,
          containerId: upgradeDeckId,
        },
      })
    })

    // Shuffle decks
    actions.push(GameHelpers.shuffleContainer(boatDeckId))
    actions.push(GameHelpers.shuffleContainer(upgradeDeckId))

    // Deal boat market (3 cards)
    if (boatMarketId) {
      actions.push({
        type: 'DRAW_FROM_CONTAINER',
        payload: {
          containerId: boatDeckId,
          count: 3,
          toContainerId: boatMarketId,
        },
      })
    }

    // Deal upgrade market (3 cards)
    if (upgradeMarketId) {
      actions.push({
        type: 'DRAW_FROM_CONTAINER',
        payload: {
          containerId: upgradeDeckId,
          count: 3,
          toContainerId: upgradeMarketId,
        },
      })
    }

    // Place Open Water card
    const openWater = this.getCardsByType('special')[0]
    if (openWater) {
      actions.push({
        type: 'MOVE_COMPONENT',
        payload: {
          componentId: openWater.id,
          position: { x: 700, y: 120 },
        },
      })
    }

    // Start at-sea phase
    actions.push(GameHelpers.changePhase('at-sea'))

    return actions
  }

  /**
   * At Sea phase - draw tokens and place on boats
   */
  drawTokens(): GameActionPayload[] {
    const actions: GameActionPayload[] = []
    const seaBagId = this.getContainerId('Sea Bag')
    if (!seaBagId) return actions

    const tokensPerDraw = GameHelpers.getNumericVariable(this.state, 'tokensPerDraw', 5)

    // Draw tokens from sea bag
    actions.push({
      type: 'DRAW_FROM_CONTAINER',
      payload: {
        containerId: seaBagId,
        count: tokensPerDraw,
        // Tokens will be manually placed by player
      },
    })

    return actions
  }

  /**
   * End of Day phase - pay upkeep, spawn fish, advance round
   */
  endOfDay(): GameActionPayload[] {
    const actions: GameActionPayload[] = []

    // Pay upkeep for boats
    const playerBoatsId = this.getContainerId('My Boats')
    if (playerBoatsId) {
      const boats = GameHelpers.getCardsInContainer(this.state, playerBoatsId)
      let totalUpkeep = 0

      boats.forEach((boat) => {
        const upkeep = boat.properties.upkeep as number || 0
        totalUpkeep += upkeep
      })

      if (totalUpkeep > 0) {
        actions.push(GameHelpers.payMoney(this.state, totalUpkeep))
      }
    }

    // Spawn fish in Deep Sea
    let openWaterId: string | undefined
    for (const [id, component] of this.state.components.entries()) {
      if (component.name === 'Open Water') {
        openWaterId = id
        break
      }
    }

    if (openWaterId) {
      // Get tokens under boats and on Open Water
      const deepSeaTokens: Token[] = []
      this.state.components.forEach((component) => {
        if (component.type === 'token' && component.position) {
          // Check if token is in deep sea area (simplified)
          deepSeaTokens.push(component as Token)
        }
      })

      // Count by type
      const fishCounts: Record<string, number> = {}
      deepSeaTokens.forEach((token) => {
        if (token.tokenType !== 'water') {
          fishCounts[token.tokenType] = (fishCounts[token.tokenType] || 0) + 1
        }
      })

      // Spawn new fish
      const seaBagId = this.getContainerId('Sea Bag')
      if (seaBagId) {
        Object.entries(fishCounts).forEach(([fishType, count]) => {
          const spawnActions = GameHelpers.spawnFish(this.state, seaBagId, fishType)
          actions.push(...spawnActions)
        })
      }
    }

    // Move all tokens back to sea bag
    const seaBagId = this.getContainerId('Sea Bag')
    if (seaBagId) {
      this.state.components.forEach((component) => {
        if (component.type === 'token' && component.position) {
          actions.push({
            type: 'MOVE_COMPONENT',
            payload: {
              componentId: component.id,
              containerId: seaBagId,
            },
          })
        }
      })

      // Shuffle sea bag
      actions.push(GameHelpers.shuffleContainer(seaBagId))
    }

    // Advance round
    actions.push(GameHelpers.advanceRound(this.state))

    // Check if game should end
    const currentRound = GameHelpers.getNumericVariable(this.state, 'round', 1)
    const maxRounds = GameHelpers.getNumericVariable(this.state, 'maxRounds', 7)

    if (currentRound >= maxRounds) {
      actions.push(GameHelpers.changePhase('game-over'))
    } else {
      actions.push(GameHelpers.changePhase('at-sea'))
    }

    return actions
  }

  /**
   * Check win condition
   */
  checkWinCondition(): boolean {
    return GameHelpers.checkWinCondition(this.state, 40, {
      sardine: 4,
      scallop: 4,
    })
  }

  // Helper methods
  private getContainerId(name: string): string | undefined {
    for (const [id, component] of this.state.components.entries()) {
      if (component.type === 'container' && component.name === name) {
        return id
      }
    }
    return undefined
  }

  private getTokensByType(tokenType: string): Token[] {
    const tokens: Token[] = []
    this.state.components.forEach((component) => {
      if (component.type === 'token' && (component as Token).tokenType === tokenType) {
        tokens.push(component as Token)
      }
    })
    return tokens
  }

  private getCardsByType(cardType: string): Card[] {
    const cards: Card[] = []
    this.state.components.forEach((component) => {
      if (component.type === 'card' && (component as Card).cardType === cardType) {
        cards.push(component as Card)
      }
    })
    return cards
  }
}
