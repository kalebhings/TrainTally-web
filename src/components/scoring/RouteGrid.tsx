import type { ScoreLimits } from '../../domain/score-entry/limits'
import type { PlayerEntry } from '../../domain/score-entry/score-entry'
import type { RouteScoringEntry } from '../../domain/scoring/route/route-scoring'

import { maxRouteCount } from '../../domain/score-entry/limits'

import { formatPoints } from '../display'
import { Section } from '../Section'
import { RouteStepperGrid } from './RouteStepperGrid'

// Points another player's trains scored for this player.
export interface ReceivedRouteDisplay {
  builderId: string
  builderName: string
  points: number
}

interface RouteGridProps {
  scoringTable: RouteScoringEntry[]
  playerEntry: PlayerEntry
  limits: ScoreLimits
  routeScore: number
  received?: ReceivedRouteDisplay[]
  onChange: (length: number, delta: number) => void
}

export function RouteGrid({
  scoringTable,
  playerEntry,
  limits,
  routeScore,
  received = [],
  onChange,
}: RouteGridProps) {
  return (
    <Section
      title="Routes"
      aside={
        <span className="font-semibold tabular-nums text-blue-600">
          {routeScore} pts
        </span>
      }
    >
      <RouteStepperGrid
        scoringTable={scoringTable}
        counts={playerEntry.routeCounts}
        maxFor={(length) => maxRouteCount(playerEntry, length, limits)}
        onChange={onChange}
      />

      {received.length > 0 && (
        // These points are already in routeScore; this explains why.
        <ul className="mt-3 grid gap-1 text-sm text-gray-600">
          {received.map((route) => (
            <li key={route.builderId}>
              Includes {formatPoints(route.points)} pts from{' '}
              <span className="font-semibold">{route.builderName}</span>'s
              trains
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}
