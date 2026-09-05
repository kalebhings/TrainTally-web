import { useEffect, useMemo, useState } from 'react'

import type {
  GameVersion,
  GameVersionIndex,
} from '../domain/game-version'

import { loadGameVersion } from '../config/load-game-version'
import { PlayerSetupRow } from '../components/PlayerSetupRow'

import type { PlayerSetup } from '../domain/game-setup'

interface NewGameScreenProps {
  gameVersionIndex: GameVersionIndex
  onBack: () => void
  onStartGame: (
    gameVersion: GameVersion,
    players: PlayerSetup[],
  ) => void
}

function getRandomItem<T>(items: T[]): T | undefined {
  if (items.length === 0) {
    return undefined
  }

  const index = Math.floor(Math.random() * items.length)

  return items[index]
}

function getUnusedColors(
  colors: string[],
  players: PlayerSetup[],
  excludePlayerIndex?: number,
): string[] {
  const usedColors = new Set(
    players
      .filter((_, index) => index !== excludePlayerIndex)
      .map((player) => player.color)
      .filter(Boolean),
  )

  return colors.filter(
    (color) => !usedColors.has(color),
  )
}

export function NewGameScreen({
  gameVersionIndex,
  onBack,
  onStartGame,
}: NewGameScreenProps) {
  const [selectedGameVersionId, setSelectedGameVersionId] =
    useState(gameVersionIndex.versions[0]?.id ?? '')

  const selectedGameVersion = useMemo(
    () =>
      gameVersionIndex.versions.find(
        (version) =>
          version.id === selectedGameVersionId,
      ),
    [
      gameVersionIndex,
      selectedGameVersionId,
    ],
  )

  const [gameVersion, setGameVersion] =
    useState<GameVersion | null>(null)

  const [loadError, setLoadError] =
    useState<string | null>(null)

  const [playerCount, setPlayerCount] = useState(
    selectedGameVersion?.minPlayers ?? 2,
  )

  const [players, setPlayers] = useState<PlayerSetup[]>([])

  useEffect(() => {
    if (!selectedGameVersion) {
      setGameVersion(null)
      return
    }

    setGameVersion(null)
    setLoadError(null)

    loadGameVersion(selectedGameVersion.configFile)
      .then(setGameVersion)
      .catch((error: unknown) => {
        console.error(error)
        setLoadError('Failed to load game version.')
      })
  }, [selectedGameVersion])

  useEffect(() => {
    if (!selectedGameVersion) {
      return
    }

    setPlayerCount(selectedGameVersion.minPlayers)
  }, [selectedGameVersion])

  useEffect(() => {
    if (!gameVersion) {
      return
    }

    setPlayers((currentPlayers) => {
      const nextPlayers = currentPlayers
        .slice(0, playerCount)
        .map((player) => ({ ...player }))

      while (nextPlayers.length < playerCount) {
        nextPlayers.push({
          id: crypto.randomUUID(),
          name: '',
          color: '',
        })
      }

      const usedColors = new Set<string>()

      for (const player of nextPlayers) {
        const colorIsValid =
          gameVersion.playerColors.includes(player.color)

        const colorIsUnique =
          !usedColors.has(player.color)

        if (
          player.color &&
          colorIsValid &&
          colorIsUnique
        ) {
          usedColors.add(player.color)
          continue
        }

        const unusedColors =
          gameVersion.playerColors.filter(
            (color) => !usedColors.has(color),
          )

        const newColor =
          getRandomItem(unusedColors) ?? ''

        player.color = newColor

        if (newColor) {
          usedColors.add(newColor)
        }
      }

      return nextPlayers
    })
  }, [
    playerCount,
    gameVersion,
  ])

  if (!selectedGameVersion) {
    return (
      <main>
        <p>No game versions available.</p>

        <button onClick={onBack}>
          Back
        </button>
      </main>
    )
  }

  function updatePlayerName(
    index: number,
    name: string,
  ) {
    setPlayers((currentPlayers) =>
      currentPlayers.map((player, playerIndex) =>
        playerIndex === index
          ? { ...player, name }
          : player,
      ),
    )
  }

  function updatePlayerColor(
    index: number,
    newColor: string,
  ) {
    if (!gameVersion) {
      return
    }

    setPlayers((currentPlayers) => {
      const nextPlayers = currentPlayers.map(
        (player) => ({ ...player }),
      )

      const currentColor =
        nextPlayers[index].color

      const conflictingPlayerIndex =
        nextPlayers.findIndex(
          (player, playerIndex) =>
            playerIndex !== index &&
            player.color === newColor,
        )

      // No other player has this color.
      if (conflictingPlayerIndex === -1) {
        nextPlayers[index].color = newColor
        return nextPlayers
      }

      const unusedColors = getUnusedColors(
        gameVersion.playerColors,
        nextPlayers,
      )

      const replacementColor =
        getRandomItem(unusedColors)

      if (replacementColor) {
        // Give the displaced player a random unused color.
        nextPlayers[conflictingPlayerIndex].color =
          replacementColor

        nextPlayers[index].color = newColor

        return nextPlayers
      }

      // Every available color is already assigned,
      // so swap the two players' colors.
      nextPlayers[conflictingPlayerIndex].color =
        currentColor

      nextPlayers[index].color = newColor

      return nextPlayers
    })
  }

  const hasValidPlayerColors =
    players.length === playerCount &&
    players.every((player) => player.color !== '') &&
    new Set(players.map((player) => player.color)).size === players.length

  return (
    <main className="new-game-screen">
      <div className="screen-header">
        <button onClick={onBack}>
          Back
        </button>

        <h1>New Game</h1>
      </div>

      <section className="setup-section">
        <h2>Game Version</h2>

        <select
          value={selectedGameVersionId}
          onChange={(event) =>
            setSelectedGameVersionId(
              event.target.value,
            )
          }
        >
          {gameVersionIndex.versions.map(
            (version) => (
              <option
                key={version.id}
                value={version.id}
              >
                {version.displayName}
              </option>
            ),
          )}
        </select>

        {loadError && (
          <p>{loadError}</p>
        )}
      </section>

      <section className="setup-section">
        <h2>Players</h2>

        <div className="player-count-control">
          <button
            onClick={() =>
              setPlayerCount((count) =>
                Math.max(
                  selectedGameVersion.minPlayers,
                  count - 1,
                ),
              )
            }
          >
            -
          </button>

          <span>{playerCount}</span>

          <button
            onClick={() =>
              setPlayerCount((count) =>
                Math.min(
                  selectedGameVersion.maxPlayers,
                  count + 1,
                ),
              )
            }
          >
            +
          </button>
        </div>

        <div className="player-list">
          {players.map((player, index) => (
            <PlayerSetupRow
              key={player.id}
              index={index}
              name={player.name}
              color={player.color}
              availableColors={
                gameVersion?.playerColors ?? []
              }
              onNameChange={(name) =>
                updatePlayerName(index, name)
              }
              onColorChange={(color) =>
                updatePlayerColor(index, color)
              }
            />
          ))}
        </div>
      </section>

      <button
        className="primary-button"
        disabled={
          !gameVersion || 
          !hasValidPlayerColors
        }
        onClick={() => {
          if (!gameVersion) {
            return
          }

          onStartGame(
            gameVersion,
            players,
          )
        }}
      >
        Start Game
      </button>
    </main>
  )
}