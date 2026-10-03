import { useEffect, useState } from 'react'

import type { GameVersionIndex } from './domain/game-version'
import type { GameSetup } from './domain/game-setup'

import { loadBonuses } from './config/load-bonuses'
import { loadGameVersionIndex } from './config/load-game-version-index'
import { loadRouteScoring } from './config/load-route-scoring'
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
    // Warm the shared config cache so the first game version
    // loads without waiting on these.
    loadBonuses().catch(() => {})
    loadRouteScoring().catch(() => {})

    loadGameVersionIndex()
      .then(setGameVersionIndex)
      .catch((error: unknown) => {
        console.error(error)
        setError('Failed to load game versions.')
      })
  }, [])

  return (
    <AppShell>
      {error && (
        <p className="mb-4 rounded-xl bg-red-50 p-3 text-red-700">
          {error}
        </p>
      )}

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
            <p className="text-gray-500">Loading game versions...</p>
          )}

          {gameVersionIndex && (
            <NewGameScreen
              gameVersionIndex={gameVersionIndex}
              onBack={() => setScreen('home')}
              onStartGame={(setup) => {
                setGameSetup(setup)
                setScreen('scoring')
              }}
            />
          )}
        </>
      )}

      {screen === 'scoring' && gameSetup && (
        <ScoringScreen
          gameSetup={gameSetup}
          onExit={() => setScreen('home')}
          onNewGame={() => setScreen('new-game')}
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