import type { PlayerSetup } from '../../domain/game-setup'

import {
  playerAccentHex,
  playerColorHex,
  playerTextColor,
} from '../display'

interface PlayerTabsProps {
  players: PlayerSetup[]
  totals: Map<string, number>
  selectedPlayerId: string
  onSelect: (playerId: string) => void
}

export function PlayerTabs({
  players,
  totals,
  selectedPlayerId,
  onSelect,
}: PlayerTabsProps) {
  return (
    <div
      className="-mx-4 flex gap-3 overflow-x-auto px-4 py-2"
      role="tablist"
      aria-label="Players"
    >
      {players.map((player) => {
        const selected = player.id === selectedPlayerId
        const total = totals.get(player.id) ?? 0

        if (selected) {
          return (
            <button
              key={player.id}
              type="button"
              role="tab"
              aria-selected="true"
              className="min-w-28 shrink-0 rounded-xl border-2 px-4 py-2 text-center shadow-md ring-2 ring-gray-900 ring-offset-2"
              style={{
                backgroundColor: playerColorHex(player.color),
                borderColor: playerAccentHex(player.color),
                color: playerTextColor(player.color),
              }}
              onClick={() => onSelect(player.id)}
            >
              <span className="block max-w-32 truncate font-bold">
                {player.name}
              </span>
              <span className="block text-sm font-semibold tabular-nums">
                {total}
              </span>
            </button>
          )
        }

        return (
          <button
            key={player.id}
            type="button"
            role="tab"
            aria-selected="false"
            className="min-w-24 shrink-0 rounded-xl border border-gray-300 bg-white px-4 py-2 text-center text-gray-500"
            onClick={(event) => {
              // Keep the chosen tab fully visible when the strip scrolls.
              event.currentTarget.scrollIntoView({
                block: 'nearest',
                inline: 'nearest',
                behavior: 'smooth',
              })
              onSelect(player.id)
            }}
          >
            <span className="flex max-w-32 items-center justify-center gap-1.5">
              <span
                className="size-2.5 shrink-0 rounded-full border border-gray-300"
                style={{ backgroundColor: playerColorHex(player.color) }}
                aria-hidden="true"
              />
              <span className="truncate">{player.name}</span>
            </span>
            <span className="block text-sm tabular-nums">{total}</span>
          </button>
        )
      })}
    </div>
  )
}