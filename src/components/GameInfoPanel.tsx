import { useGameStore } from '@/stores/gameStore'

export default function GameInfoPanel() {
  const gameName = useGameStore((state) => state.gameName)
  const currentPhase = useGameStore((state) => state.currentPhase)
  const variables = useGameStore((state) => state.variables)
  const saveGame = useGameStore((state) => state.saveGame)

  const money = variables.get('money') as number || 0
  const round = variables.get('round') as number || 1
  const maxRounds = variables.get('maxRounds') as number || 7

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>{gameName}</h2>
        <button style={styles.saveButton} onClick={() => saveGame()}>
          Save Game
        </button>
      </div>

      <div style={styles.stats}>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Round:</span>
          <span style={styles.statValue}>
            {round} / {maxRounds}
          </span>
        </div>

        <div style={styles.statItem}>
          <span style={styles.statLabel}>Money:</span>
          <span style={styles.statValue}>€{money}</span>
        </div>

        <div style={styles.statItem}>
          <span style={styles.statLabel}>Phase:</span>
          <span style={styles.phaseValue}>{formatPhase(currentPhase)}</span>
        </div>
      </div>
    </div>
  )
}

function formatPhase(phase: string): string {
  return phase
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const styles = {
  container: {
    backgroundColor: '#1a1a2e',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    border: '2px solid #16c79a',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.5rem',
    color: '#16c79a',
    margin: 0,
  },
  saveButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#16c79a',
    color: '#1a1a2e',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold' as const,
  },
  stats: {
    display: 'flex',
    gap: '2rem',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#888',
    marginBottom: '0.25rem',
  },
  statValue: {
    fontSize: '1.3rem',
    color: '#fff',
    fontWeight: 'bold' as const,
  },
  phaseValue: {
    fontSize: '1.3rem',
    color: '#16c79a',
    fontWeight: 'bold' as const,
  },
}
