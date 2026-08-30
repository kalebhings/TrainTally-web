import { describe, expect, it } from 'vitest'

import type { SimpleBonus, PlayerRankedBonus } from '../bonus/bonuses'
import type { PlayerBonusInputs } from './bonus-resolution'

import { mergePlayerBonusInputs } from './merge-player-bonus-inputs'

describe('mergePlayerBonusInputs', () => {
  const longestRouteBonus: SimpleBonus = {
    id: 'longest_route',
    displayName: 'Longest Route',
    description: 'Longest continuous path of trains',
    scoringType: 'simple',
    points: 10,
    isExclusive: true,
    isPerItem: false,
    maxCount: null,
  }

  const bulletTrainBonus: PlayerRankedBonus = {
    id: 'bullet_train',
    displayName: 'Bullet Train Participation',
    description: 'Bullet train participation ranking and player count',
    scoringType: 'playerRanked',
    participationPenalty: -20,
    scoringData: {
      rankedPoints: {
        '2': [10, -10],
      },
    },
  }

  it('merges bonus inputs for the same player', () => {
    const manualResults: PlayerBonusInputs[] = [
      {
        playerId: 'player-1',
        bonusInputs: [
          {
            bonus: longestRouteBonus,
            count: 1,
          },
        ],
      },
      {
        playerId: 'player-2',
        bonusInputs: [
          {
            bonus: longestRouteBonus,
            count: 0,
          },
        ],
      },
    ]

    const rankedResults: PlayerBonusInputs[] = [
      {
        playerId: 'player-1',
        bonusInputs: [
          {
            bonus: bulletTrainBonus,
            playerCount: 2,
            rank: 1,
            participated: true,
          },
        ],
      },
      {
        playerId: 'player-2',
        bonusInputs: [
          {
            bonus: bulletTrainBonus,
            playerCount: 2,
            rank: 2,
            participated: true,
          },
        ],
      },
    ]

    const result = mergePlayerBonusInputs([
      manualResults,
      rankedResults,
    ])

    expect(result).toEqual([
      {
        playerId: 'player-1',
        bonusInputs: [
          {
            bonus: longestRouteBonus,
            count: 1,
          },
          {
            bonus: bulletTrainBonus,
            playerCount: 2,
            rank: 1,
            participated: true,
          },
        ],
      },
      {
        playerId: 'player-2',
        bonusInputs: [
          {
            bonus: longestRouteBonus,
            count: 0,
          },
          {
            bonus: bulletTrainBonus,
            playerCount: 2,
            rank: 2,
            participated: true,
          },
        ],
      },
    ])
  })

  it('handles an empty list of groups', () => {
    const result = mergePlayerBonusInputs([])

    expect(result).toEqual([])
  })

  it('handles players that only appear in one group', () => {
    const result = mergePlayerBonusInputs([
      [
        {
          playerId: 'player-1',
          bonusInputs: [
            {
              bonus: longestRouteBonus,
              count: 1,
            },
          ],
        },
      ],
    ])

    expect(result).toEqual([
      {
        playerId: 'player-1',
        bonusInputs: [
          {
            bonus: longestRouteBonus,
            count: 1,
          },
        ],
      },
    ])
  })
})