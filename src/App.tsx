import { useEffect, useState } from 'react'

import type {
  GameVersion,
  GameVersionIndex,
} from './domain/game-version'

import type { BonusConfig } from './domain/scoring/bonuses'
import type { RouteScoringConfig } from './domain/scoring/route-scoring'

import { loadGameVersionIndex } from './config/load-game-version-index'
import { loadGameVersion } from './config/load-game-version'
import { loadBonuses } from './config/load-bonuses'
import { loadRouteScoring } from './config/load-route-scoring'

function App() {
  const [gameVersionIndex, setGameVersionIndex] =
    useState<GameVersionIndex | null>(null)

  const [routeScoringConfig, setRouteScoringConfig] =
    useState<RouteScoringConfig | null>(null)

  const [bonusConfig, setBonusConfig] =
    useState<BonusConfig | null>(null)

  const [selectedVersionId, setSelectedVersionId] = useState('')

  const [gameVersion, setGameVersion] =
    useState<GameVersion | null>(null)

  const [error, setError] = useState<string | null>(null)

  // Load app-wide configuration once when the app starts.
  useEffect(() => {
    Promise.all([
      loadGameVersionIndex(),
      loadRouteScoring(),
      loadBonuses(),
    ])
      .then(([index, routeScoring, bonuses]) => {
        setGameVersionIndex(index)
        setRouteScoringConfig(routeScoring)
        setBonusConfig(bonuses)
      })
      .catch((error: unknown) => {
        console.error(error)
        setError('Failed to load app configuration.')
      })
  }, [])

  // Load the full configuration for the selected game version.
  useEffect(() => {
    if (!gameVersionIndex || !selectedVersionId) {
      setGameVersion(null)
      return
    }

    const selectedEntry = gameVersionIndex.versions.find(
      (version) => version.id === selectedVersionId,
    )

    if (!selectedEntry) {
      setGameVersion(null)
      return
    }

    setGameVersion(null)
    setError(null)

    loadGameVersion(selectedEntry.configFile)
      .then(setGameVersion)
      .catch((error: unknown) => {
        console.error(error)
        setGameVersion(null)
        setError('Failed to load selected game version.')
      })
  }, [gameVersionIndex, selectedVersionId])

  // Resolve the route-scoring ID from the selected version
  // into the actual scoring table from route-scoring.json.
  const routeScoringTable =
    gameVersion && routeScoringConfig
      ? routeScoringConfig.scoringTables[gameVersion.routeScoring]
      : undefined

  // Resolve the bonus IDs from the selected version
  // into full bonus objects from bonuses.json.
  const resolvedBonuses =
    gameVersion && bonusConfig
      ? gameVersion.bonuses.flatMap((bonusId) => {
          const bonus = bonusConfig.bonuses[bonusId]

          return bonus ? [bonus] : []
        })
      : []

  return (
    <main>
      <h1>TrainTally</h1>

      {error && <p>{error}</p>}

      {!gameVersionIndex && !error && (
        <p>Loading app configuration...</p>
      )}

      {gameVersionIndex && (
        <section>
          <label htmlFor="game-version">
            Game version
          </label>

          <select
            id="game-version"
            value={selectedVersionId}
            onChange={(event) => {
              setSelectedVersionId(event.target.value)
            }}
          >
            <option value="">
              Choose a version
            </option>

            {gameVersionIndex.versions.map((version) => (
              <option
                key={version.id}
                value={version.id}
              >
                {version.displayName}
              </option>
            ))}
          </select>
        </section>
      )}

      {selectedVersionId && !gameVersion && !error && (
        <p>Loading selected version...</p>
      )}

      {gameVersion && (
        <>
          <section>
            <h2>{gameVersion.displayName}</h2>

            <p>
              Players: {gameVersion.minPlayers}
              {' - '}
              {gameVersion.maxPlayers}
            </p>

            <p>
              Train cars per player:{' '}
              {gameVersion.trainCarsPerPlayer}
            </p>

            <p>
              Stations per player:{' '}
              {gameVersion.stationsPerPlayer ?? 'None'}
            </p>

            <p>
              Player colors:{' '}
              {gameVersion.playerColors.join(', ')}
            </p>
          </section>

          <section>
            <h3>Features</h3>

            <ul>
              <li>
                Stations:{' '}
                {gameVersion.features.hasStations ? 'Yes' : 'No'}
              </li>

              <li>
                Meeples:{' '}
                {gameVersion.features.hasMeeples ? 'Yes' : 'No'}
              </li>

              <li>
                Ferries:{' '}
                {gameVersion.features.hasFerries ? 'Yes' : 'No'}
              </li>

              <li>
                Ships:{' '}
                {gameVersion.features.hasShips ? 'Yes' : 'No'}
              </li>
            </ul>
          </section>

          <section>
            <h3>Route Scoring</h3>

            <p>
              Table ID: {gameVersion.routeScoring}
            </p>

            {!routeScoringTable && (
              <p>
                Could not find the configured route scoring table.
              </p>
            )}

            {routeScoringTable && (
              <ul>
                {routeScoringTable.map((entry) => (
                  <li key={entry.length}>
                    Length {entry.length}: {entry.points}{' '}
                    {entry.points === 1 ? 'point' : 'points'}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h3>Bonuses</h3>

            {resolvedBonuses.length === 0 ? (
              <p>None</p>
            ) : (
              <ul>
                {resolvedBonuses.map((bonus) => (
                  <li key={bonus.id}>
                    <strong>{bonus.displayName}</strong>
                    {' — '}
                    {bonus.points}{' '}
                    {bonus.points === 1 ? 'point' : 'points'}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {gameVersion.meepleConfig && (
            <section>
              <h3>Meeple Scoring</h3>

              <p>
                Colors:{' '}
                {gameVersion.meepleConfig.colors.join(', ')}
              </p>

              <p>
                Majority:{' '}
                {gameVersion.meepleConfig.majorityPoints} points
              </p>

              <p>
                Second place:{' '}
                {gameVersion.meepleConfig.secondPlacePoints} points
              </p>
            </section>
          )}
        </>
      )}
    </main>
  )
}

export default App