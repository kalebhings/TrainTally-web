import type { PlayerMeepleCount } from './meeple'
import type { PlayerMeepleScore } from './meeple'
import type { MeepleConfig } from '../../game-version'

interface MeepleColorStanding {
  playerId: string
  count: number
}

export function calculateMeepleScores(
  players: PlayerMeepleCount[],
  config: MeepleConfig,
): PlayerMeepleScore[] {
  const totals = new Map<string, number>()

  for (const player of players) {
    totals.set(player.playerId, 0)
  }

  for (const color of config.colors) {
    const colorScores = calculateColorScores(
      players,
      color,
      config,
    )

    for (const result of colorScores) {
      const current = totals.get(result.playerId) ?? 0
      totals.set(result.playerId, current + result.score)
    }
  }

  return players.map((player) => ({
    playerId: player.playerId,
    score: totals.get(player.playerId) ?? 0,
  }))
}

function calculateColorScores(
  players: PlayerMeepleCount[],
  color: string,
  config: MeepleConfig,
): PlayerMeepleScore[] {
  const standings: MeepleColorStanding[] = players
    .map((player) => ({
      playerId: player.playerId,
      count: player.counts[color] ?? 0,
    }))
    .filter((player) => player.count > 0)
    .sort((a, b) => b.count - a.count)

  if (standings.length === 0) {
    return []
  }

  const highestCount = standings[0].count

  const firstPlacePlayers = standings.filter(
    (player) => player.count === highestCount,
  )

  if (firstPlacePlayers.length > 1) {
    return firstPlacePlayers.map((player) => ({
      playerId: player.playerId,
      score: config.majorityPoints,
    }))
  }

  const results: PlayerMeepleScore[] = [
    {
      playerId: firstPlacePlayers[0].playerId,
      score: config.majorityPoints,
    },
  ]

  const secondPlaceStanding = standings.find(
    (player) => player.count < highestCount,
  )

  if (secondPlaceStanding === undefined) {
    return results
  }

  const secondPlaceCount = secondPlaceStanding.count

  const secondPlacePlayers = standings.filter(
    (player) => player.count === secondPlaceCount,
  )

  for (const player of secondPlacePlayers) {
    results.push({
      playerId: player.playerId,
      score: config.secondPlacePoints,
    })
  }

  return results
}