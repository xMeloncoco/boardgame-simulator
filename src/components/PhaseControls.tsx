import { useGameStore } from '@/stores/gameStore'
import { ConservasGame } from '@/games/conservas/ConservasGame'
import { GameDefinition } from '@/types/gameDefinition'

interface PhaseControlsProps {
  gameDefinition: GameDefinition
}

export default function PhaseControls({ gameDefinition }: PhaseControlsProps) {
  const currentPhase = useGameStore((state) => state.currentPhase)
  const state = useGameStore((state) => state)
  const dispatch = useGameStore((state) => state.dispatch)
  const batchDispatch = useGameStore((state) => state.batchDispatch)
  const setPhase = useGameStore((state) => state.setPhase)

  const game = new ConservasGame(gameDefinition, state)

  const handleDrawTokens = () => {
    const actions = game.drawTokens()
    batchDispatch(actions)
  }

  const handleEndOfDay = () => {
    const actions = game.endOfDay()
    batchDispatch(actions)
  }

  const handleNextPhase = () => {
    const phaseOrder = ['at-sea', 'on-land', 'end-of-day']
    const currentIndex = phaseOrder.indexOf(currentPhase)
    if (currentIndex >= 0 && currentIndex < phaseOrder.length - 1) {
      setPhase(phaseOrder[currentIndex + 1])
    }
  }

  const handleCheckWin = () => {
    const won = game.checkWinCondition()
    if (won) {
      alert('Congratulations! You won!')
      setPhase('game-over')
    } else {
      alert('Not yet! Keep playing.')
    }
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Phase Controls</h3>

      {currentPhase === 'at-sea' && (
        <div style={styles.phaseControls}>
          <p style={styles.instruction}>
            Draw tokens from the sea bag and place them on your boats or open water
          </p>
          <button style={styles.button} onClick={handleDrawTokens}>
            Draw 5 Tokens
          </button>
          <button style={styles.secondaryButton} onClick={handleNextPhase}>
            Proceed to Land →
          </button>
        </div>
      )}

      {currentPhase === 'on-land' && (
        <div style={styles.phaseControls}>
          <p style={styles.instruction}>
            Sell fish to market, buy boats and upgrades
          </p>
          <button style={styles.secondaryButton} onClick={handleNextPhase}>
            End of Day →
          </button>
        </div>
      )}

      {currentPhase === 'end-of-day' && (
        <div style={styles.phaseControls}>
          <p style={styles.instruction}>Pay upkeep, fish spawn, advance to next round</p>
          <button style={styles.button} onClick={handleEndOfDay}>
            Process End of Day
          </button>
        </div>
      )}

      {currentPhase === 'game-over' && (
        <div style={styles.phaseControls}>
          <p style={styles.instruction}>Game complete!</p>
          <button style={styles.button} onClick={handleCheckWin}>
            Check Win Condition
          </button>
        </div>
      )}

      <div style={styles.debugSection}>
        <button style={styles.debugButton} onClick={handleCheckWin}>
          Check Win (Debug)
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    backgroundColor: '#1a1a2e',
    padding: '1rem',
    borderRadius: '8px',
    border: '2px solid #16c79a',
  },
  title: {
    fontSize: '1.2rem',
    color: '#16c79a',
    marginTop: 0,
    marginBottom: '1rem',
  },
  phaseControls: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  instruction: {
    fontSize: '0.95rem',
    color: '#ccc',
    marginBottom: '0.5rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#16c79a',
    color: '#1a1a2e',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold' as const,
    fontSize: '1rem',
  },
  secondaryButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#2a2a4e',
    color: '#fff',
    border: '2px solid #16c79a',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold' as const,
    fontSize: '1rem',
  },
  debugSection: {
    marginTop: '1.5rem',
    paddingTop: '1rem',
    borderTop: '1px solid #444',
  },
  debugButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#444',
    color: '#ccc',
    border: '1px solid #666',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
}
