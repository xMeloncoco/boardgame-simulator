import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useGameStore } from '@/stores/gameStore'
import GameCanvas from '@/components/GameCanvas'
import GameInfoPanel from '@/components/GameInfoPanel'
import PhaseControls from '@/components/PhaseControls'
import { GameLoader } from '@/utils/gameLoader'
import { ConservasGame } from '@/games/conservas/ConservasGame'
import { GameDefinition } from '@/types/gameDefinition'

export default function GamePlayScreen() {
  const navigate = useNavigate()
  const [gameDefinition, setGameDefinition] = useState<GameDefinition | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const initializeGame = useGameStore((state) => state.initializeGame)
  const batchDispatch = useGameStore((state) => state.batchDispatch)
  const gameName = useGameStore((state) => state.gameName)

  useEffect(() => {
    async function loadGame() {
      try {
        // Load Conservas game definition
        const response = await fetch('/games/conservas-january.json')
        if (!response.ok) {
          throw new Error('Failed to load game definition')
        }

        const json = await response.text()
        const definition = await GameLoader.loadFromJSON(json)
        setGameDefinition(definition)

        // Initialize game state
        const initialState = GameLoader.initializeGameFromDefinition(definition)
        initializeGame(initialState.gameId, initialState.gameName)

        // Copy initial state
        Object.entries(initialState).forEach(([key, value]) => {
          if (key === 'components') {
            ;(value as Map<string, unknown>).forEach((component, id) => {
              useGameStore.getState().addComponent(component as never)
            })
          } else if (key === 'variables') {
            ;(value as Map<string, number | string | boolean>).forEach((val, name) => {
              useGameStore.getState().setVariable(name, val)
            })
          }
        })

        // Run setup
        const game = new ConservasGame(definition, useGameStore.getState())
        const setupActions = game.setupGame()
        batchDispatch(setupActions)

        setLoading(false)
      } catch (err) {
        console.error('Error loading game:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    }

    if (!gameName) {
      loadGame()
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loading}>Loading Conservas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>Error: {error}</p>
        <button style={styles.backButton} onClick={() => navigate('/')}>
          Back to Menu
        </button>
      </div>
    )
  }

  if (!gameDefinition) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>No game loaded</p>
        <button style={styles.backButton} onClick={() => navigate('/')}>
          Back to Menu
        </button>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <GameInfoPanel />
        <PhaseControls gameDefinition={gameDefinition} />
        <button style={styles.exitButton} onClick={() => navigate('/')}>
          Exit Game
        </button>
      </div>

      <div style={styles.gameArea}>
        <GameCanvas />
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#0f0f1e',
    color: '#eee',
  },
  sidebar: {
    width: '320px',
    padding: '1rem',
    backgroundColor: '#0f0f1e',
    borderRight: '2px solid #16c79a',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    overflowY: 'auto' as const,
  },
  gameArea: {
    flex: 1,
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  loading: {
    fontSize: '1.5rem',
    color: '#16c79a',
  },
  error: {
    fontSize: '1.2rem',
    color: '#ff6b6b',
    marginBottom: '1rem',
  },
  exitButton: {
    padding: '0.75rem',
    backgroundColor: '#ff6b6b',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold' as const,
    marginTop: 'auto',
  },
  backButton: {
    padding: '0.8rem 2rem',
    fontSize: '1rem',
    backgroundColor: '#16c79a',
    color: '#1a1a2e',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold' as const,
  },
}
