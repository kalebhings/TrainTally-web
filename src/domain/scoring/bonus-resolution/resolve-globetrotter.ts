import type { SimpleBonus } from '../bonus/bonuses'
import type {
  PlayerBonusInputs,
  PlayerCompletedTicketCount,
} from './bonus-resolution'

import { resolveManualBonus } from './resolve-manual-bonus'

export function resolveGlobetrotter(
  bonus: SimpleBonus,
  players: PlayerCompletedTicketCount[],
  overridePlayerIds?: string[],
): PlayerBonusInputs[] {
  const playerIds = players.map((player) => player.playerId)

  if (overridePlayerIds !== undefined) {
    return resolveManualBonus(
      bonus,
      playerIds,
      overridePlayerIds,
    )
  }

  if (players.length === 0) {
    return []
  }

  const highestCompletedTicketCount = Math.max(
    ...players.map((player) => player.completedTicketCount),
  )

  const awardedPlayerIds = players
    .filter(
      (player) =>
        player.completedTicketCount === highestCompletedTicketCount,
    )
    .map((player) => player.playerId)

  return resolveManualBonus(
    bonus,
    playerIds,
    awardedPlayerIds,
  )
}