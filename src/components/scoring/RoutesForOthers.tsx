import { useState } from 'react'

import type { PlayerSetup } from '../../domain/game-setup'
import type { ScoreLimits } from '../../domain/score-entry/limits'
import type { PlayerEntry } from '../../domain/score-entry/score-entry'
import type { RouteScoringEntry } from '../../domain/scoring/route/route-scoring'

import { maxRouteCountFor } from '../../domain/score-entry/limits'
import { calculateRouteScore } from '../../domain/scoring/route/calculate-route-score'
import { formatPoints, playerAccentHex } from '../display'
import { Section } from '../Section'
import { RouteStepperGrid } from './RouteStepperGrid'

interface RoutesForOthersProps {
  playerId: string
  players: PlayerSetup[]
  playerEntry: PlayerEntry
  scoringTable: RouteScoringEntry[]
  limits: ScoreLimits
  onChange: (scorerId: string, length: number, delta: number) => void
}

export function RoutesForOthers({
  playerId,
  players,
  playerEntry,
  scoringTable,
  limits,
  onChange,
}: RoutesForOthersProps) {
  const others = players.filter((player) => player.id !== playerId)
  const [scorerId, setScorerId] = useState(others[0]?.id ?? '')
  const scorer = others.find((player) => player.id === scorerId)

  const countsFor = (id: string) => playerEntry.routesForOthers[id] ?? {}
  const pointsFor = (id: string) =>
    calculateRouteScore(countsFor(id), scoringTable)

  const counts = countsFor(scorerId)

  return (
    <Section
      title="Your trains, their points"
      aside={
        <span className="font-semibold tabular-nums text-blue-600">
          {pointsFor(scorerId)} pts
        </span>
      }
    >
      <p className="-mt-1 mb-3 text-sm text-gray-500">
        Routes you built into another player's station city. Uses your
        train cars; the points go to them.
      </p>

      <div
        className="mb-3 flex flex-wrap gap-2"
        role="radiogroup"
        aria-label="Points go to"
      >
        {others.map((player) => {
          const selected = player.id === scorerId
          const points = pointsFor(player.id)

          return (
            <button
              key={player.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`min-h-10 rounded-full border-2 px-4 text-sm font-semibold ${
                selected ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
              }`}
              style={{ borderColor: playerAccentHex(player.color) }}
              onClick={() => setScorerId(player.id)}
            >
              {player.name}
              {points > 0 && (
                <span className="tabular-nums opacity-75">
                  {' '}
                  · {formatPoints(points)}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {scorer && (
        <RouteStepperGrid
          scoringTable={scoringTable}
          counts={counts}
          maxFor={(length) =>
            maxRouteCountFor(counts[length] ?? 0, length, playerEntry, limits)
          }
          labelPrefix={`${scorer.name}'s`}
          onChange={(length, delta) => onChange(scorerId, length, delta)}
        />
      )}
    </Section>
  )
}
