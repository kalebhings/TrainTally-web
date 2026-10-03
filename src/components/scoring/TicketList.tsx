import { useId, useState } from 'react'

import type { ScoreLimits } from '../../domain/score-entry/limits'
import type { TicketEntry } from '../../domain/score-entry/score-entry'

import { isValidTicketPoints } from '../../domain/score-entry/limits'
import { formatPoints } from '../display'
import { Section } from '../Section'
import { Toggle } from '../Toggle'

interface TicketListProps {
  tickets: TicketEntry[]
  limits: ScoreLimits
  ticketScore: number
  onAdd: (points: number, completed: boolean) => void
  onToggle: (ticketId: string) => void
  onRemove: (ticketId: string) => void
}

export function TicketList({
  tickets,
  limits,
  ticketScore,
  onAdd,
  onToggle,
  onRemove,
}: TicketListProps) {
  const hintId = useId()
  const [draftPoints, setDraftPoints] = useState('')
  const [draftCompleted, setDraftCompleted] = useState(true)

  const max = limits.maxTicketPoints
  const points = Number.parseInt(draftPoints, 10)
  const canAdd = isValidTicketPoints(points, limits)
  const showInvalid = draftPoints !== '' && !canAdd

  return (
    <Section
      title="Destination Tickets"
      aside={
        <span
          className={`font-semibold tabular-nums ${
            ticketScore < 0 ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {formatPoints(ticketScore)} pts
        </span>
      }
    >
      <form
        className="grid gap-3"
        onSubmit={(event) => {
          event.preventDefault()

          if (!canAdd) {
            return
          }

          onAdd(points, draftCompleted)
          setDraftPoints('')
        }}
      >
        <div className="flex items-center gap-3">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={String(max).length}
            className={`min-h-12 w-16 rounded-lg border px-3 text-center text-lg font-semibold tabular-nums ${
              showInvalid
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-300'
            }`}
            placeholder="Pts"
            aria-label="Ticket points"
            aria-invalid={showInvalid}
            aria-describedby={hintId}
            value={draftPoints}
            onChange={(event) =>
              setDraftPoints(event.target.value.replace(/\D/g, ''))
            }
          />

          <label className="flex items-center gap-2 text-sm">
            <Toggle
              checked={draftCompleted}
              label="Ticket completed"
              onChange={setDraftCompleted}
            />
            {draftCompleted ? 'Completed' : 'Failed'}
          </label>

          <button
            type="submit"
            className="ml-auto min-h-12 rounded-xl bg-blue-600 px-4 font-semibold text-white disabled:bg-gray-300"
            disabled={!canAdd}
          >
            Add
          </button>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-500 tabular-nums">
          <span aria-hidden="true">1</span>
          <input
            type="range"
            min={1}
            max={max}
            step={1}
            className="h-8 flex-1 accent-blue-600"
            aria-label="Ticket points slider"
            value={canAdd ? points : 1}
            onChange={(event) => setDraftPoints(event.target.value)}
          />
          <span aria-hidden="true">{max}</span>
        </div>

        <p
          id={hintId}
          className={`-mt-2 text-sm ${showInvalid ? 'text-red-600' : 'text-gray-500'}`}
        >
          {showInvalid
            ? `Ticket points must be 1–${max}.`
            : `Type or slide a value from 1 to ${max}.`}
        </p>
      </form>

      {tickets.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {tickets.map((ticket) => (
            <li
              key={ticket.id}
              className={`flex items-center rounded-full border text-sm font-semibold tabular-nums ${
                ticket.completed
                  ? 'border-green-300 bg-green-50 text-green-800'
                  : 'border-red-300 bg-red-50 text-red-800'
              }`}
            >
              <button
                type="button"
                className="min-h-10 py-1 pr-1 pl-3"
                aria-label={`${ticket.points} point ticket, ${
                  ticket.completed ? 'completed' : 'failed'
                }. Tap to switch.`}
                onClick={() => onToggle(ticket.id)}
              >
                {ticket.completed ? '✓' : '✗'} {ticket.points}
              </button>

              <button
                type="button"
                className="min-h-10 px-3 opacity-60"
                aria-label={`Remove ${ticket.points} point ticket`}
                onClick={() => onRemove(ticket.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}