import { useEffect, useState } from 'react'

import type { GameConfig } from '../domain/game-config'
import type { GameVersionIndex } from '../domain/game-version'
import type { GameSetup } from '../domain/game-setup'

import { loadGameConfig } from '../config/load-game-config'
import { PlayerSetupRow } from '../components/PlayerSetupRow'
import { Section } from '../components/Section'
import {
  createPlayerSetup,
  finalizePlayers,
  hasValidPlayerColors,
  reassignColor,
  reconcilePlayers,
} from '../domain/game-setup'

interface NewGameScreenProps {
  gameVersionIndex: GameVersionIndex
  onBack: () => void
  onStartGame: (setup: GameSetup) => void
}

// A load result tagged with the version it belongs to, so a stale
// result can never be shown for a different selection.
type LoadState =
  | { versionId: string; config: GameConfig }
  | { versionId: string; error: string }

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function NewGameScreen({
  gameVersionIndex,
  onBack,
  onStartGame,
}: NewGameScreenProps) {
  const [selectedVersionId, setSelectedVersionId] =
    useState(gameVersionIndex.versions[0]?.id ?? '')

  const selectedEntry = gameVersionIndex.versions.find(
    (version) => version.id === selectedVersionId,
  )

  const [loadState, setLoadState] =
    useState<LoadState | null>(null)

  const [players, setPlayers] = useState(() =>
    Array.from(
      { length: selectedEntry?.minPlayers ?? 2 },
      createPlayerSetup,
    ),
  )

  const current =
    loadState?.versionId === selectedVersionId ? loadState : null
  const config = current && 'config' in current ? current.config : null
  const loadError = current && 'error' in current ? current.error : null
  const colors = config?.gameVersion.playerColors ?? []

  useEffect(() => {
    if (!selectedEntry) {
      return
    }

    let ignore = false

    loadGameConfig(selectedEntry.configFile)
      .then((loadedConfig) => {
        if (ignore) {
          return
        }

        const { minPlayers, maxPlayers, playerColors } =
          loadedConfig.gameVersion

        setLoadState({
          versionId: selectedEntry.id,
          config: loadedConfig,
        })

        // Keep the current player count when the new version allows it.
        setPlayers((currentPlayers) =>
          reconcilePlayers(
            currentPlayers,
            clamp(currentPlayers.length, minPlayers, maxPlayers),
            playerColors,
          ),
        )
      })
      .catch((error: unknown) => {
        console.error(error)

        if (!ignore) {
          setLoadState({
            versionId: selectedEntry.id,
            error: 'Failed to load game version.',
          })
        }
      })

    return () => {
      ignore = true
    }
  }, [selectedEntry])

  if (!selectedEntry) {
    return (
      <main>
        <p>No game versions available.</p>

        <button onClick={onBack}>
          Back
        </button>
      </main>
    )
  }

  const minPlayers = selectedEntry.minPlayers
  const maxPlayers = selectedEntry.maxPlayers

  function changePlayerCount(delta: number) {
    setPlayers((currentPlayers) =>
      reconcilePlayers(
        currentPlayers,
        clamp(currentPlayers.length + delta, minPlayers, maxPlayers),
        colors,
      ),
    )
  }

  function updatePlayerName(index: number, name: string) {
    setPlayers((currentPlayers) =>
      currentPlayers.map((player, playerIndex) =>
        playerIndex === index ? { ...player, name } : player,
      ),
    )
  }

  function updatePlayerColor(index: number, color: string) {
    setPlayers((currentPlayers) =>
      reassignColor(currentPlayers, index, color, colors),
    )
  }

  const canStart =
    config !== null &&
    players.length >= minPlayers &&
    players.length <= maxPlayers &&
    hasValidPlayerColors(players, colors)

  return (
    <main className="mx-auto grid w-full max-w-xl gap-4 pb-24">
      <header className="flex items-center gap-3">
        <button
          type="button"
          className="min-h-11 rounded-full border border-gray-300 bg-white px-4 font-medium"
          onClick={onBack}
        >
          Back
        </button>

        <h1 className="text-2xl font-bold">New Game</h1>
      </header>

      <Section title="Game Version">
        <select
          className="min-h-12 w-full rounded-lg border border-gray-300 bg-white px-3 text-base"
          value={selectedVersionId}
          onChange={(event) =>
            setSelectedVersionId(event.target.value)
          }
        >
          {gameVersionIndex.versions.map((version) => (
            <option key={version.id} value={version.id}>
              {version.displayName}
            </option>
          ))}
        </select>

        {loadError && (
          <p className="mt-2 text-sm text-red-600">{loadError}</p>
        )}
      </Section>

      <Section
        title="Players"
        aside={
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full bg-gray-200 text-xl font-semibold disabled:opacity-30"
              aria-label="Remove player"
              disabled={!config || players.length <= minPlayers}
              onClick={() => changePlayerCount(-1)}
            >
              −
            </button>

            <span className="w-6 text-center text-lg font-semibold tabular-nums">
              {players.length}
            </span>

            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full bg-gray-200 text-xl font-semibold disabled:opacity-30"
              aria-label="Add player"
              disabled={!config || players.length >= maxPlayers}
              onClick={() => changePlayerCount(1)}
            >
              +
            </button>
          </div>
        }
      >
        <div className="grid gap-3">
          {players.map((player, index) => (
            <PlayerSetupRow
              key={player.id}
              index={index}
              name={player.name}
              color={player.color}
              availableColors={colors}
              onNameChange={(name) =>
                updatePlayerName(index, name)
              }
              onColorChange={(color) =>
                updatePlayerColor(index, color)
              }
            />
          ))}
        </div>
      </Section>

      <div className="fixed inset-x-0 bottom-0 border-t border-gray-200 bg-white/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur">
        <button
          type="button"
          className="mx-auto block min-h-12 w-full max-w-xl rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white disabled:bg-gray-300"
          disabled={!canStart}
          onClick={() => {
            if (!config) {
              return
            }

            onStartGame({
              config,
              players: finalizePlayers(players),
            })
          }}
        >
          {config
            ? 'Start Game'
            : loadError
              ? 'Version unavailable'
              : 'Loading…'}
        </button>
      </div>
    </main>
  )
}