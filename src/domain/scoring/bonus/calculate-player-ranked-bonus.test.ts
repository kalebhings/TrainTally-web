import { describe, expect, it } from 'vitest'

import type { PlayerRankedBonus } from './bonuses'
import { calculatePlayerRankedBonus } from './calculate-player-ranked-bonus'

describe('calculatePlayerRankedBonus', () => {
    const bonus: PlayerRankedBonus = {
    id: 'bullet_train',
    displayName: 'Bullet Train Participation',
    description: 'Bullet train participation ranking and player count',
    scoringType: 'playerRanked',
    participationPenalty: -20,
    scoringData: {
        rankedPoints: {
        '2': [10, -10],
        '3': [15, 5, -10],
        '4': [20, 10, 0, -10],
        '5': [25, 15, 5, -5, -10],
        },
    },
    }

  it('returns the first-place score for a four-player game', () => {
    const result = calculatePlayerRankedBonus(
      bonus,
      4,
      1,
      true,
    )

    expect(result).toBe(20)
  })

  it('returns the second-place score for a four-player game', () => {
    const result = calculatePlayerRankedBonus(
      bonus,
      4,
      2,
      true,
    )

    expect(result).toBe(10)
  })

  it('can return zero as a valid ranked score', () => {
    const result = calculatePlayerRankedBonus(
      bonus,
      4,
      3,
      true,
    )

    expect(result).toBe(0)
  })

  it('returns a negative score for the last-place player', () => {
    const result = calculatePlayerRankedBonus(
      bonus,
      4,
      4,
      true,
    )

    expect(result).toBe(-10)
  })

  it('uses the scoring table for the correct player count', () => {
    const result = calculatePlayerRankedBonus(
      bonus,
      5,
      1,
      true,
    )

    expect(result).toBe(25)
  })

  it('returns the no-participation penalty when the player did not participate', () => {
    const result = calculatePlayerRankedBonus(
      bonus,
      4,
      1,
      false,
    )

    expect(result).toBe(-20)
  })

  it('returns 0 when there is no scoring table for the player count', () => {
    const result = calculatePlayerRankedBonus(
      bonus,
      6,
      1,
      true,
    )

    expect(result).toBe(0)
  })

  it('returns 0 when the rank is outside the scoring table', () => {
    const result = calculatePlayerRankedBonus(
      bonus,
      4,
      5,
      true,
    )

    expect(result).toBe(0)
  })
})