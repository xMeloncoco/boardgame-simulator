import { GameState, GameComponent } from '@/types/game'

export interface SerializedGameState {
  gameId: string
  gameName: string
  components: [string, GameComponent][]
  variables: [string, number | string | boolean][]
  currentPhase: string
  actionHistory: Array<{
    type: string
    payload: unknown
    timestamp: number
  }>
}

export const serializeGameState = (state: GameState): SerializedGameState => {
  return {
    gameId: state.gameId,
    gameName: state.gameName,
    components: Array.from(state.components.entries()),
    variables: Array.from(state.variables.entries()),
    currentPhase: state.currentPhase,
    actionHistory: state.actionHistory,
  }
}

export const deserializeGameState = (serialized: SerializedGameState): GameState => {
  return {
    gameId: serialized.gameId,
    gameName: serialized.gameName,
    components: new Map(serialized.components),
    variables: new Map(serialized.variables),
    currentPhase: serialized.currentPhase,
    actionHistory: serialized.actionHistory.map((action) => ({
      type: action.type as GameState['actionHistory'][0]['type'],
      payload: action.payload,
      timestamp: action.timestamp,
    })),
  }
}

export const saveGameToLocalStorage = (state: GameState, slotName: string = 'autosave'): void => {
  try {
    const serialized = serializeGameState(state)
    const json = JSON.stringify(serialized)
    localStorage.setItem(`game-save-${slotName}`, json)
    localStorage.setItem(`game-save-${slotName}-timestamp`, new Date().toISOString())
  } catch (error) {
    console.error('Failed to save game:', error)
    throw new Error('Failed to save game state')
  }
}

export const loadGameFromLocalStorage = (slotName: string = 'autosave'): GameState | null => {
  try {
    const json = localStorage.getItem(`game-save-${slotName}`)
    if (!json) return null

    const serialized = JSON.parse(json) as SerializedGameState
    return deserializeGameState(serialized)
  } catch (error) {
    console.error('Failed to load game:', error)
    return null
  }
}

export const listSavedGames = (): Array<{ slot: string; timestamp: string; gameName: string }> => {
  const saves: Array<{ slot: string; timestamp: string; gameName: string }> = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('game-save-') && !key.endsWith('-timestamp')) {
      const slotName = key.replace('game-save-', '')
      const timestampKey = `${key}-timestamp`
      const timestamp = localStorage.getItem(timestampKey) || 'Unknown'

      try {
        const json = localStorage.getItem(key)
        if (json) {
          const state = JSON.parse(json) as SerializedGameState
          saves.push({
            slot: slotName,
            timestamp,
            gameName: state.gameName || 'Untitled Game',
          })
        }
      } catch {
        // Skip invalid saves
      }
    }
  }

  return saves.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
}

export const deleteSavedGame = (slotName: string): void => {
  localStorage.removeItem(`game-save-${slotName}`)
  localStorage.removeItem(`game-save-${slotName}-timestamp`)
}

export const exportGameState = (state: GameState): string => {
  const serialized = serializeGameState(state)
  return JSON.stringify(serialized, null, 2)
}

export const importGameState = (json: string): GameState => {
  try {
    const serialized = JSON.parse(json) as SerializedGameState
    return deserializeGameState(serialized)
  } catch (error) {
    console.error('Failed to import game state:', error)
    throw new Error('Invalid game state JSON')
  }
}
