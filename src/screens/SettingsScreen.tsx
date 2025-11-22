import { useNavigate } from 'react-router-dom'

export default function SettingsScreen() {
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Settings</h1>
      <div style={styles.content}>
        <p style={styles.placeholder}>Settings panel coming soon!</p>
        <p style={styles.hint}>Future options: theme, sound, controls, etc.</p>
      </div>
      <button style={styles.backButton} onClick={() => navigate('/')}>
        Back to Menu
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
    fontSize: '2.5rem',
    marginBottom: '2rem',
    color: '#16c79a',
  },
  content: {
    textAlign: 'center' as const,
    marginBottom: '2rem',
  },
  placeholder: {
    fontSize: '1.2rem',
    color: '#888',
  },
  hint: {
    fontSize: '1rem',
    color: '#666',
    marginTop: '1rem',
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
