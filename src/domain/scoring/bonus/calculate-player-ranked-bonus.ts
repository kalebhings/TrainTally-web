import type { PlayerRankedBonus } from "./bonuses";

export function calculatePlayerRankedBonus(
  bonus: PlayerRankedBonus,
  playerCount: number,
  rank: number,
  participated: boolean,
): number {
  if (!participated) {
    return bonus.participationPenalty ?? 0
  }

  const rankedPoints = bonus.scoringData.rankedPoints[playerCount.toString()]

  if (rankedPoints === undefined) {
    return 0
  }

  const score = rankedPoints[rank - 1]

  return score ?? 0
}