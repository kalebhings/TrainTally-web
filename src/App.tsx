import { useEffect, useState } from 'react'

import type { GameVersionIndex } from './domain/game-version'
import type { GameSetup } from './domain/game-setup'

import { loadGameVersionIndex } from './config/load-game-version-index'
import { AppShell } from './components/AppShell'
import { HomeScreen } from './screens/HomeScreen'
import { NewGameScreen } from './screens/NewGameScreen'
import { ScoringScreen } from './screens/ScoringScreen'

type Screen =
  | 'home'
  | 'new-game'
  | 'history'
  | 'settings'
  | 'scoring'

function App() {
  const [screen, setScreen] = useState<Screen>('home')

  const [gameVersionIndex, setGameVersionIndex] =
    useState<GameVersionIndex | null>(null)

  const [gameSetup, setGameSetup] =
    useState<GameSetup | null>(null)

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    loadGameVersionIndex()
      .then(setGameVersionIndex)
      .catch((error: unknown) => {
        console.error(error)
        setError('Failed to load game versions.')
      })
  }, [])

  return (
    <AppShell>
      {error && <p>{error}</p>}

      {screen === 'home' && (
        <HomeScreen
          onNewGame={() => setScreen('new-game')}
          onHistory={() => setScreen('history')}
          onSettings={() => setScreen('settings')}
        />
      )}

      {screen === 'new-game' && (
        <>
          {!gameVersionIndex && !error && (
            <p>Loading game versions...</p>
          )}

          {gameVersionIndex && (
            <NewGameScreen
              gameVersionIndex={gameVersionIndex}
              onBack={() => setScreen('home')}
              onStartGame={(gameVersion, players) => {
                setGameSetup({
                  gameVersion,
                  players,
                })

                setScreen('scoring')
              }}
            />
          )}
        </>
      )}

      {screen === 'scoring' && gameSetup && (
        <ScoringScreen
          gameSetup={gameSetup}
          onBack={() => setScreen('new-game')}
        />
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