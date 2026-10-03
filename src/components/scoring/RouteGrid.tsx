import type { ScoreLimits } from '../../domain/score-entry/limits'
import type { RouteScoringEntry } from '../../domain/scoring/route/route-scoring'

import { maxRouteCount } from '../../domain/score-entry/limits'

import { formatPoints } from '../display'
import { Section } from '../Section'
import { Stepper } from '../Stepper'

interface RouteGridProps {
  scoringTable: RouteScoringEntry[]
  routeCounts: Record<number, number>
  limits: ScoreLimits
  routeScore: number
  onChange: (length: number, delta: number) => void
}

export function RouteGrid({
  scoringTable,
  routeCounts,
  limits,
  routeScore,
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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {scoringTable.map((entry) => (
          <div
            key={entry.length}
            className="flex flex-col items-center gap-1 rounded-xl bg-gray-50 p-3"
          >
            <span className="text-lg font-semibold">
              {entry.length} {entry.length === 1 ? 'car' : 'cars'}
            </span>
            <span className="text-sm text-gray-500">
              {formatPoints(entry.points)} pts
            </span>
            <Stepper
              label={`${entry.length}-car routes`}
              value={routeCounts[entry.length] ?? 0}
              max={maxRouteCount(routeCounts, entry.length, limits)}
              onChange={(delta) => onChange(entry.length, delta)}
            />
          </div>
        ))}
      </div>
    </Section>
  )
}