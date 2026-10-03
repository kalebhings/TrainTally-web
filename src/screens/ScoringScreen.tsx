import { useMemo, useReducer, useState } from 'react'

import type { GameSetup } from '../domain/game-setup'

import { BonusSection } from '../components/scoring/BonusSection'
import { PlayerTabs } from '../components/scoring/PlayerTabs'
import { RouteGrid } from '../components/scoring/RouteGrid'
import { TicketList } from '../components/scoring/TicketList'
import { TrainCarsMeter } from '../components/scoring/TrainCarsMeter'
import {
  createPlayerEntry,
  createScoreEntry,
  scoreEntryReducer,
} from '../domain/score-entry/score-entry'
import { trainCarsUsed } from '../domain/score-entry/limits'
import { entryIssues, scoreGame } from '../domain/score-entry/score-game'
import {
  playerAccentHex,
  playerColorHex,
  playerTextColor,
} from '../components/display'
import { ResultsScreen } from './ResultsScreen'

interface ScoringScreenProps {
  gameSetup: GameSetup
  onExit: () => void
  onNewGame: () => void
}

const headerButtonClass = 'min-h-11 rounded-full px-4 font-medium'

export function ScoringScreen({
  gameSetup,
  onExit,
  onNewGame,
}: ScoringScreenProps) {
  const { config, players } = gameSetup

  const [entry, dispatch] = useReducer(
    scoreEntryReducer,
    gameSetup,
    createScoreEntry,
  )

  const [selectedPlayerId, setSelectedPlayerId] =
    useState(players[0]?.id ?? '')

  const [view, setView] =
    useState<'entry' | 'results'>('entry')

  const [confirmingExit, setConfirmingExit] = useState(false)

  // Comparative bonuses mean one player's input can change another
  // player's score, so the whole game is scored together.
  const result = useMemo(
    () => scoreGame(config, players, entry),
    [config, players, entry],
  )

  const scoredById = useMemo(
    () =>
      new Map(
        result.scoredPlayers.map((scored) => [scored.player.id, scored]),
      ),
    [result],
  )

  const totals = useMemo(
    () =>
      new Map(
        result.scoredPlayers.map((scored) => [
          scored.player.id,
          scored.score.total,
        ]),
      ),
    [result],
  )

  if (view === 'results') {
    return (
      <ResultsScreen
        config={config}
        result={result}
        onBack={() => setView('entry')}
        onNewGame={onNewGame}
        onHome={onExit}
      />
    )
  }

  const scored = scoredById.get(selectedPlayerId)
  const playerEntry =
    entry.players[selectedPlayerId] ?? createPlayerEntry()
  const selectedIndex = players.findIndex(
    (player) => player.id === selectedPlayerId,
  )
  const selectedPlayer = players[selectedIndex]
  const issues = entryIssues(players, entry)

  return (
    <main className="mx-auto grid w-full max-w-xl gap-4">
      <header className="sticky top-0 z-10 -mx-4 grid gap-3 bg-gray-50/95 px-4 pt-[env(safe-area-inset-top)] pb-3 backdrop-blur">
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            className={`${headerButtonClass} border border-gray-300 bg-white`}
            onClick={() => setConfirmingExit(true)}
          >
            Exit
          </button>

          <h1 className="truncate text-lg font-semibold">
            {config.gameVersion.displayName}
          </h1>

          <button
            type="button"
            className={`${headerButtonClass} bg-blue-600 text-white disabled:bg-gray-300`}
            disabled={issues.length > 0}
            onClick={() => setView('results')}
          >
            Finish
          </button>
        </div>

        {confirmingExit && (
          <div
            className="flex flex-wrap items-center gap-3 rounded-xl bg-red-50 p-3 text-sm"
            role="alertdialog"
            aria-label="Discard game"
          >
            <span className="font-medium text-red-800">
              Discard this game? Scores won't be saved.
            </span>
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                className="min-h-10 rounded-full bg-white px-4 font-medium"
                onClick={() => setConfirmingExit(false)}
              >
                Keep scoring
              </button>
              <button
                type="button"
                className="min-h-10 rounded-full bg-red-600 px-4 font-medium text-white"
                onClick={onExit}
              >
                Discard
              </button>
            </div>
          </div>
        )}

        {issues.length > 0 && (
          <ul
            className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800"
            role="alert"
          >
            {issues.map((issue) => (
              <li key={issue.playerId}>{issue.message}</li>
            ))}
          </ul>
        )}

        <PlayerTabs
          players={players}
          totals={totals}
          selectedPlayerId={selectedPlayerId}
          onSelect={setSelectedPlayerId}
        />
      </header>

      {scored && selectedPlayer && (
        // Keyed by player so per-panel drafts reset when switching tabs.
        <div
          key={selectedPlayerId}
          className="grid gap-4 pb-8"
          role="tabpanel"
          aria-label={`Scoring for ${selectedPlayer.name}`}
        >
          <div
            className="flex items-baseline justify-between gap-3 rounded-2xl border-2 px-4 py-3 shadow-sm"
            style={{
              backgroundColor: playerColorHex(selectedPlayer.color),
              borderColor: playerAccentHex(selectedPlayer.color),
              color: playerTextColor(selectedPlayer.color),
            }}
          >
            <p className="truncate text-lg">
              Scoring: <span className="font-bold">{selectedPlayer.name}</span>
            </p>
            <p className="shrink-0 text-sm opacity-90">
              Player {selectedIndex + 1} of {players.length}
            </p>
          </div>

          <TrainCarsMeter
            used={trainCarsUsed(playerEntry.routeCounts)}
            total={config.gameVersion.trainCarsPerPlayer}
          />

          <RouteGrid
            scoringTable={config.routeScoringTable}
            routeCounts={playerEntry.routeCounts}
            limits={entry.limits}
            routeScore={scored.score.routeScore}
            onChange={(length, delta) =>
              dispatch({
                type: 'changeRouteCount',
                playerId: selectedPlayerId,
                length,
                delta,
              })
            }
          />

          <TicketList
            tickets={playerEntry.tickets}
            limits={entry.limits}
            ticketScore={scored.score.destinationTicketScore}
            onAdd={(points, completed) =>
              dispatch({
                type: 'addTicket',
                playerId: selectedPlayerId,
                ticket: {
                  id: crypto.randomUUID(),
                  points,
                  completed,
                },
              })
            }
            onToggle={(ticketId) =>
              dispatch({
                type: 'toggleTicket',
                playerId: selectedPlayerId,
                ticketId,
              })
            }
            onRemove={(ticketId) =>
              dispatch({
                type: 'removeTicket',
                playerId: selectedPlayerId,
                ticketId,
              })
            }
          />

          <BonusSection
            config={config}
            players={players}
            playerId={selectedPlayerId}
            playerEntry={playerEntry}
            entry={entry}
            scored={scored}
            dispatch={dispatch}
          />
        </div>
      )}
    </main>
  )
}