import type { GameVersion } from '../game-version'

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

// Highest count allowed for routes of `length` given the cars already used.
export function maxRouteCount(
  routeCounts: Record<number, number>,
  length: number,
  limits: ScoreLimits,
): number {
  const remainingCars = Math.max(
    0,
    limits.trainCarsPerPlayer - trainCarsUsed(routeCounts),
  )

  return (routeCounts[length] ?? 0) + Math.floor(remainingCars / length)
}