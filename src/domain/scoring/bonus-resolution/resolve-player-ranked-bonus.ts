import type { PlayerRankedBonus } from '../bonus/bonuses'
import type {
  PlayerBonusInputs,
  PlayerRankedValue,
} from './bonus-resolution'

export function resolvePlayerRankedBonus(
  bonus: PlayerRankedBonus,
  players: PlayerRankedValue[],
): PlayerBonusInputs[] {
  const participatingPlayers = players
    .filter((player) => player.participated)
    .sort((a, b) => b.value - a.value)

  const ranks = new Map<string, number>()

  let previousValue: number | undefined
  let previousRank = 0

  participatingPlayers.forEach((player, index) => {
    let rank = index + 1

    if (player.value === previousValue) {
      rank = previousRank
    }

    ranks.set(player.playerId, rank)

    previousValue = player.value
    previousRank = rank
  })

  const playerCount = players.length

  return players.map((player) => ({
    playerId: player.playerId,
    bonusInputs: [
      {
        bonus,
        playerCount,
        rank: ranks.get(player.playerId) ?? 0,
        participated: player.participated,
      },
    ],
  }))
}