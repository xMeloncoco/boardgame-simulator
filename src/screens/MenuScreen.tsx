import { useNavigate } from 'react-router-dom'

export default function MenuScreen() {
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Board Game Simulator</h1>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate('/games')}>
          Play Game
        </button>
        <button style={styles.button} onClick={() => navigate('/create')}>
          Create Game
        </button>
        <button style={styles.button} onClick={() => navigate('/settings')}>
          Settings
        </button>
      </div>
      <div style={styles.footer}>
        <p>Phase 1: Foundation Complete</p>
        <p>Version 0.1.0</p>
      </div>
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
    fontSize: '3rem',
    marginBottom: '3rem',
    color: '#16c79a',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    width: '300px',
  },
  button: {
    padding: '1rem 2rem',
    fontSize: '1.2rem',
    backgroundColor: '#16c79a',
    color: '#1a1a2e',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold' as const,
    transition: 'background-color 0.3s',
  },
  footer: {
    position: 'absolute' as const,
    bottom: '20px',
    textAlign: 'center' as const,
    color: '#888',
    fontSize: '0.9rem',
  },
}
