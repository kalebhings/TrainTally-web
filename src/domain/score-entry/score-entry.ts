import type { GameSetup } from '../game-setup'
import type { ScoreLimits } from './limits'

import {
  isValidTicketPoints,
  maxRouteCount,
  scoreLimits,
} from './limits'

export interface TicketEntry {
  id: string
  points: number
  completed: boolean
}

export interface RankedValueEntry {
  value: number
  participated: boolean
}

// Raw values a player enters. Scores are always derived from this,
// never stored, so totals can't drift out of sync with inputs.
export interface PlayerEntry {
  routeCounts: Record<number, number>
  tickets: TicketEntry[]
  bonusCounts: Record<string, number>
  rankedValues: Record<string, RankedValueEntry>
  regionGroups: Record<string, number[]>
  meepleCounts: Record<string, number>
}

export interface ScoreEntry {
  // Fixed for the game; the reducer refuses values outside them.
  limits: ScoreLimits
  players: Record<string, PlayerEntry>
  // bonusId → awarded player ids. Ties are allowed.
  manualAwards: Record<string, string[]>
  // bonusId → awarded player ids. Missing means "calculate automatically".
  awardOverrides: Record<string, string[]>
}

export type ScoreEntryAction =
  | { type: 'changeRouteCount'; playerId: string; length: number; delta: number }
  | { type: 'addTicket'; playerId: string; ticket: TicketEntry }
  | { type: 'toggleTicket'; playerId: string; ticketId: string }
  | { type: 'removeTicket'; playerId: string; ticketId: string }
  | { type: 'setBonusCount'; playerId: string; bonusId: string; count: number }
  | { type: 'setRankedValue'; playerId: string; bonusId: string; value: number }
  | { type: 'setRankedParticipation'; playerId: string; bonusId: string; participated: boolean }
  | { type: 'addRegionGroup'; playerId: string; bonusId: string; size: number }
  | { type: 'removeRegionGroup'; playerId: string; bonusId: string; index: number }
  | { type: 'changeMeepleCount'; playerId: string; color: string; delta: number }
  | { type: 'toggleManualAward'; bonusId: string; playerId: string }
  | { type: 'setAwardOverride'; bonusId: string; playerIds: string[] }
  | { type: 'clearAwardOverride'; bonusId: string }

export const EMPTY_RANKED_VALUE: RankedValueEntry = {
  value: 0,
  participated: false,
}

export function createPlayerEntry(): PlayerEntry {
  return {
    routeCounts: {},
    tickets: [],
    bonusCounts: {},
    rankedValues: {},
    regionGroups: {},
    meepleCounts: {},
  }
}

export function createScoreEntry({
  config,
  players,
}: GameSetup): ScoreEntry {
  return {
    limits: scoreLimits(config.gameVersion),
    players: Object.fromEntries(
      players.map((player) => [player.id, createPlayerEntry()]),
    ),
    manualAwards: {},
    awardOverrides: {},
  }
}

function toCount(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0
}

export function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id)
    ? ids.filter((existing) => existing !== id)
    : [...ids, id]
}

function updatePlayer(
  state: ScoreEntry,
  playerId: string,
  update: (player: PlayerEntry) => PlayerEntry,
): ScoreEntry {
  const player = state.players[playerId]

  if (!player) {
    return state
  }

  return {
    ...state,
    players: {
      ...state.players,
      [playerId]: update(player),
    },
  }
}

function updatePlayerAction(
  player: PlayerEntry,
  action: ScoreEntryAction,
  limits: ScoreLimits,
): PlayerEntry {
  switch (action.type) {
    case 'changeRouteCount': {
      const current = player.routeCounts[action.length] ?? 0
      const next = toCount(current + action.delta)

      // Only increases are limited, so a player can always back out.
      if (
        next > current &&
        next > maxRouteCount(player.routeCounts, action.length, limits)
      ) {
        return player
      }

      return {
        ...player,
        routeCounts: {
          ...player.routeCounts,
          [action.length]: next,
        },
      }
    }

    case 'addTicket':
      if (!isValidTicketPoints(action.ticket.points, limits)) {
        return player
      }

      return {
        ...player,
        tickets: [...player.tickets, action.ticket],
      }

    case 'toggleTicket':
      return {
        ...player,
        tickets: player.tickets.map((ticket) =>
          ticket.id === action.ticketId
            ? { ...ticket, completed: !ticket.completed }
            : ticket,
        ),
      }

    case 'removeTicket':
      return {
        ...player,
        tickets: player.tickets.filter(
          (ticket) => ticket.id !== action.ticketId,
        ),
      }

    case 'setBonusCount':
      return {
        ...player,
        bonusCounts: {
          ...player.bonusCounts,
          [action.bonusId]: toCount(action.count),
        },
      }

    case 'setRankedValue': {
      const current =
        player.rankedValues[action.bonusId] ?? EMPTY_RANKED_VALUE
      const value = toCount(action.value)

      return {
        ...player,
        rankedValues: {
          ...player.rankedValues,
          [action.bonusId]: {
            value,
            // Entering a value implies the player took part.
            participated: current.participated || value > 0,
          },
        },
      }
    }

    case 'setRankedParticipation': {
      const current =
        player.rankedValues[action.bonusId] ?? EMPTY_RANKED_VALUE

      return {
        ...player,
        rankedValues: {
          ...player.rankedValues,
          [action.bonusId]: {
            ...current,
            participated: action.participated,
          },
        },
      }
    }

    case 'addRegionGroup':
      return {
        ...player,
        regionGroups: {
          ...player.regionGroups,
          [action.bonusId]: [
            ...(player.regionGroups[action.bonusId] ?? []),
            action.size,
          ],
        },
      }

    case 'removeRegionGroup':
      return {
        ...player,
        regionGroups: {
          ...player.regionGroups,
          [action.bonusId]: (
            player.regionGroups[action.bonusId] ?? []
          ).filter((_, index) => index !== action.index),
        },
      }

    case 'changeMeepleCount':
      return {
        ...player,
        meepleCounts: {
          ...player.meepleCounts,
          [action.color]: toCount(
            (player.meepleCounts[action.color] ?? 0) + action.delta,
          ),
        },
      }

    default:
      return player
  }
}

export function scoreEntryReducer(
  state: ScoreEntry,
  action: ScoreEntryAction,
): ScoreEntry {
  switch (action.type) {
    case 'toggleManualAward':
      return {
        ...state,
        manualAwards: {
          ...state.manualAwards,
          [action.bonusId]: toggleId(
            state.manualAwards[action.bonusId] ?? [],
            action.playerId,
          ),
        },
      }

    case 'setAwardOverride':
      return {
        ...state,
        awardOverrides: {
          ...state.awardOverrides,
          [action.bonusId]: action.playerIds,
        },
      }

    case 'clearAwardOverride': {
      const awardOverrides = { ...state.awardOverrides }

      delete awardOverrides[action.bonusId]

      return {
        ...state,
        awardOverrides,
      }
    }

    default:
      return updatePlayer(state, action.playerId, (player) =>
        updatePlayerAction(player, action, state.limits),
      )
  }
}