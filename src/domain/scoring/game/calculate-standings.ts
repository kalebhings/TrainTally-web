import type { ScoredPlayer } from './game'

export interface RankedPlayer extends ScoredPlayer {
  rank: number
}

export function calculateStandings(
  players: ScoredPlayer[],
): RankedPlayer[] {
  const sortedPlayers = [...players].sort((a, b) => {
    const scoreDifference = b.score.total - a.score.total

    if (scoreDifference !== 0) {
      return scoreDifference
    }

    return a.player.name.localeCompare(b.player.name)
  })

  let currentRank = 0
  let previousScore: number | null = null

  return sortedPlayers.map((player, index) => {
    if (previousScore === null || player.score.total !== previousScore) {
      currentRank = index + 1
    }

    previousScore = player.score.total

    return {
      ...player,
      rank: currentRank,
    }
  })
}