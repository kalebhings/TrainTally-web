import type { RouteScoringEntry } from '../../domain/scoring/route/route-scoring'

import { formatPoints } from '../display'
import { Stepper } from '../Stepper'

interface RouteStepperGridProps {
  scoringTable: RouteScoringEntry[]
  counts: Record<number, number>
  maxFor: (length: number) => number
  // Prefix for stepper labels, e.g. "Blue's" → "Blue's 4-car routes".
  labelPrefix?: string
  onChange: (length: number, delta: number) => void
}

export function RouteStepperGrid({
  scoringTable,
  counts,
  maxFor,
  labelPrefix,
  onChange,
}: RouteStepperGridProps) {
  return (
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
            label={`${labelPrefix ? `${labelPrefix} ` : ''}${entry.length}-car routes`}
            value={counts[entry.length] ?? 0}
            max={maxFor(entry.length)}
            onChange={(delta) => onChange(entry.length, delta)}
          />
        </div>
      ))}
    </div>
  )
}
