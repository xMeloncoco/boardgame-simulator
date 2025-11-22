import { useNavigate } from 'react-router-dom'

export default function GamePlayScreen() {
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Game Board</h1>
      <div style={styles.content}>
        <div style={styles.canvas}>
          <p style={styles.placeholder}>Game canvas will render here (Phase 3)</p>
        </div>
      </div>
      <button style={styles.backButton} onClick={() => navigate('/games')}>
        Exit Game
      </button>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#1a1a2e',
    color: '#eee',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#16c79a',
  },
  content: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  canvas: {
    width: '80%',
    height: '70vh',
    backgroundColor: '#0f3460',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #16c79a',
  },
  placeholder: {
    fontSize: '1.2rem',
    color: '#888',
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
    marginBottom: '2rem',
  },
}
