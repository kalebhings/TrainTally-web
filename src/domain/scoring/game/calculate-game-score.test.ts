import { describe, expect, it } from 'vitest'

import type { PlayerGameScoreInput } from './game'
import type { RouteScoringEntry } from '../route/route-scoring'
import type { SimpleBonus, PlayerRankedBonus } from '../bonus/bonuses'

import { calculateGameScore } from './calculate-game-score'

describe('calculateGameScore', () => {
  const scoringTable: RouteScoringEntry[] = [
    { length: 1, points: 1 },
    { length: 2, points: 2 },
    { length: 3, points: 4 },
    { length: 4, points: 7 },
    { length: 5, points: 10 },
    { length: 6, points: 15 },
  ]

  const longestRouteBonus: SimpleBonus = {
    id: 'longest_route',
    displayName: 'Longest Route',
    points: 10,
    description: 'Longest continuous path of trains',
    isExclusive: true,
    isPerItem: false,
    maxCount: null,
    scoringType: 'simple',
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
        '3': [15, 5, -10],
        '4': [20, 10, 0, -10],
        '5': [25, 15, 5, -5, -10],
      },
    },
  }

  it('calculates complete scores for multiple players', () => {
    const players: PlayerGameScoreInput[] = [
      {
        player: {
          id: 'player-1',
          name: 'Alice',
          color: 'blue',
          routeCounts: {
            1: 1,
            3: 2,
            6: 1,
          },
          destinationTickets: [
            { points: 7, completed: true },
            { points: 10, completed: true },
            { points: 4, completed: false },
          ],
        },
        bonusInputs: [
          {
            bonus: longestRouteBonus,
            count: 1,
          },
        ],
      },
      {
        player: {
          id: 'player-2',
          name: 'Bob',
          color: 'red',
          routeCounts: {
            2: 1,
            4: 1,
            5: 1,
          },
          destinationTickets: [
            { points: 10, completed: false },
            { points: 6, completed: true },
          ],
        },
        bonusInputs: [
          {
            bonus: bulletTrainBonus,
            playerCount: 2,
            rank: 2,
            participated: false,
          },
        ],
      },
    ]

    const result = calculateGameScore(
      players,
      scoringTable,
    )

    expect(result).toEqual([
      {
        player: players[0].player,
        score: {
          routeScore: 24,
          destinationTicketScore: 13,
          bonusScore: 10,
          total: 47,
        },
        bonuses: [
          {
            bonusId: 'longest_route',
            score: 10,
          },
        ],
      },
      {
        player: players[1].player,
        score: {
          routeScore: 19,
          destinationTicketScore: -4,
          bonusScore: -20,
          total: -5,
        },
        bonuses: [
          {
            bonusId: 'bullet_train',
            score: -20,
          },
        ],
      },
    ])
  })

  it('returns an empty array when there are no players', () => {
    const result = calculateGameScore(
      [],
      scoringTable,
    )

    expect(result).toEqual([])
  })

  it('supports players with no bonuses', () => {
    const players: PlayerGameScoreInput[] = [
      {
        player: {
          id: 'player-1',
          name: 'Alice',
          color: 'blue',
          routeCounts: {
            3: 1,
          },
          destinationTickets: [
            { points: 5, completed: true },
          ],
        },
        bonusInputs: [],
      },
    ]

    const result = calculateGameScore(
      players,
      scoringTable,
    )

    expect(result).toEqual([
      {
        player: players[0].player,
        score: {
          routeScore: 4,
          destinationTicketScore: 5,
          bonusScore: 0,
          total: 9,
        },
        bonuses: [],
      },
    ])
  })
})