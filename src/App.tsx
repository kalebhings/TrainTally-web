import { useState } from 'react'

import { AppShell } from './components/AppShell'
import { HomeScreen } from './screens/HomeScreen'

type Screen =
  | 'home'
  | 'new-game'
  | 'history'
  | 'settings'

function App() {
  const [screen, setScreen] =
    useState<Screen>('home')

  return (
    <AppShell>
      {screen === 'home' && (
        <HomeScreen
          onNewGame={() => setScreen('new-game')}
          onHistory={() => setScreen('history')}
          onSettings={() => setScreen('settings')}
        />
      )}

      {screen === 'new-game' && (
        <main>
          <h1>New Game</h1>
          <button onClick={() => setScreen('home')}>
            Back
          </button>
        </main>
      )}

      {screen === 'history' && (
        <main>
          <h1>History</h1>
          <button onClick={() => setScreen('home')}>
            Back
          </button>
        </main>
      )}

      {screen === 'settings' && (
        <main>
          <h1>Settings</h1>
          <button onClick={() => setScreen('home')}>
            Back
          </button>
        </main>
      )}
    </AppShell>
  )
}

export default App