import type { GameVersion } from '../game-version'
import type { PlayerEntry } from './score-entry'

// Used until a version sets its own `maxTicketPoints`.
export const DEFAULT_MAX_TICKET_POINTS = 40

export interface ScoreLimits {
  trainCarsPerPlayer: number
  maxTicketPoints: number
}

export function scoreLimits(gameVersion: GameVersion): ScoreLimits {
  return {
    trainCarsPerPlayer: gameVersion.trainCarsPerPlayer,
    maxTicketPoints:
      gameVersion.maxTicketPoints ?? DEFAULT_MAX_TICKET_POINTS,
  }
}

export function isValidTicketPoints(
  points: number,
  limits: ScoreLimits,
): boolean {
  return (
    Number.isInteger(points) &&
    points >= 1 &&
    points <= limits.maxTicketPoints
  )
}

export function trainCarsUsed(
  routeCounts: Record<number, number>,
): number {
  let total = 0

  for (const [length, count] of Object.entries(routeCounts)) {
    total += Number(length) * count
  }

  return total
}

// Cars used for routes the player built for other players.
export function trainCarsUsedForOthers(player: PlayerEntry): number {
  let total = 0

  for (const counts of Object.values(player.routesForOthers)) {
    total += trainCarsUsed(counts)
  }

  return total
}

// Every car the player has on the board, whoever scored the route.
export function playerTrainCarsUsed(player: PlayerEntry): number {
  return trainCarsUsed(player.routeCounts) + trainCarsUsedForOthers(player)
}

// Highest count allowed for a stepper currently at `current` routes of
// `length`, given every car the player has already used.
export function maxRouteCountFor(
  current: number,
  length: number,
  player: PlayerEntry,
  limits: ScoreLimits,
): number {
  const remainingCars = Math.max(
    0,
    limits.trainCarsPerPlayer - playerTrainCarsUsed(player),
  )

  return current + Math.floor(remainingCars / length)
}

// Highest count allowed for the player's own routes of `length`.
export function maxRouteCount(
  player: PlayerEntry,
  length: number,
  limits: ScoreLimits,
): number {
  return maxRouteCountFor(
    player.routeCounts[length] ?? 0,
    length,
    player,
    limits,
  )
}
