import { describe, expect, it } from 'vitest'

import type { PlayerRankedBonus } from '../bonus/bonuses'
import { resolvePlayerRankedBonus } from './resolve-player-ranked-bonus'

describe('resolvePlayerRankedBonus', () => {
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

  it('assigns ranks based on player values', () => {
    const result = resolvePlayerRankedBonus(
      bonus,
      [
        { playerId: 'player-1', value: 8, participated: true },
        { playerId: 'player-2', value: 12, participated: true },
        { playerId: 'player-3', value: 4, participated: true },
      ],
    )

    expect(result[0].bonusInputs[0]).toEqual({
      bonus,
      playerCount: 3,
      rank: 2,
      participated: true,
    })

    expect(result[1].bonusInputs[0]).toEqual({
      bonus,
      playerCount: 3,
      rank: 1,
      participated: true,
    })

    expect(result[2].bonusInputs[0]).toEqual({
      bonus,
      playerCount: 3,
      rank: 3,
      participated: true,
    })
  })

  it('assigns the same rank to tied players', () => {
    const result = resolvePlayerRankedBonus(
      bonus,
      [
        { playerId: 'player-1', value: 10, participated: true },
        { playerId: 'player-2', value: 8, participated: true },
        { playerId: 'player-3', value: 8, participated: true },
        { playerId: 'player-4', value: 5, participated: true },
      ],
    )

    expect(result[0].bonusInputs[0]).toMatchObject({
      rank: 1,
    })

    expect(result[1].bonusInputs[0]).toMatchObject({
      rank: 2,
    })

    expect(result[2].bonusInputs[0]).toMatchObject({
      rank: 2,
    })

    expect(result[3].bonusInputs[0]).toMatchObject({
      rank: 4,
    })
  })

  it('marks non-participating players so the scorer can apply the penalty', () => {
    const result = resolvePlayerRankedBonus(
      bonus,
      [
        { playerId: 'player-1', value: 10, participated: true },
        { playerId: 'player-2', value: 0, participated: false },
        { playerId: 'player-3', value: 5, participated: true },
      ],
    )

    expect(result[1].bonusInputs[0]).toEqual({
      bonus,
      playerCount: 3,
      rank: 0,
      participated: false,
    })
  })

  it('does not allow non-participating players to affect participating ranks', () => {
    const result = resolvePlayerRankedBonus(
      bonus,
      [
        { playerId: 'player-1', value: 10, participated: true },
        { playerId: 'player-2', value: 100, participated: false },
        { playerId: 'player-3', value: 5, participated: true },
      ],
    )

    expect(result[0].bonusInputs[0]).toMatchObject({
      rank: 1,
    })

    expect(result[2].bonusInputs[0]).toMatchObject({
      rank: 2,
    })
  })
})