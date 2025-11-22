import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MenuScreen from './screens/MenuScreen'
import GameListScreen from './screens/GameListScreen'
import CreateGameScreen from './screens/CreateGameScreen'
import SettingsScreen from './screens/SettingsScreen'
import GamePlayScreen from './screens/GamePlayScreen'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MenuScreen />} />
        <Route path="/games" element={<GameListScreen />} />
        <Route path="/game/:id" element={<GamePlayScreen />} />
        <Route path="/create" element={<CreateGameScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
