import { describe, expect, it } from 'vitest'

import type { RouteScoringEntry } from '../route/route-scoring'
import type { SimpleBonus } from '../bonus/bonuses'

import { calculateCompleteGameScore } from './calculate-complete-game-score'

describe('calculateCompleteGameScore', () => {
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
    description: 'Longest continuous path of trains',
    scoringType: 'simple',
    points: 10,
    isExclusive: true,
    isPerItem: false,
    maxCount: null,
  }

  it('calculates complete scores and standings without meeples', () => {
    const result = calculateCompleteGameScore(
      {
        players: [
          {
            id: 'player-1',
            name: 'Alice',
            color: 'blue',
            routeCounts: {
              3: 2,
              6: 1,
            },
            destinationTickets: [
              { points: 7, completed: true },
            ],
          },
          {
            id: 'player-2',
            name: 'Bob',
            color: 'red',
            routeCounts: {
              4: 1,
              5: 1,
            },
            destinationTickets: [
              { points: 10, completed: true },
            ],
          },
        ],

        bonusInputsByPlayer: [
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
        ],
      },
      scoringTable,
    )

    expect(result.scoredPlayers[0].score).toEqual({
      routeScore: 23,
      destinationTicketScore: 7,
      bonusScore: 10,
      meepleScore: 0,
      total: 40,
    })

    expect(result.scoredPlayers[1].score).toEqual({
      routeScore: 17,
      destinationTicketScore: 10,
      bonusScore: 0,
      meepleScore: 0,
      total: 27,
    })

    expect(result.standings[0].player.id).toBe('player-1')
    expect(result.standings[0].rank).toBe(1)

    expect(result.standings[1].player.id).toBe('player-2')
    expect(result.standings[1].rank).toBe(2)
  })

  it('includes resolved meeple scores when meeple configuration is provided', () => {
    const result = calculateCompleteGameScore(
      {
        players: [
          {
            id: 'player-1',
            name: 'Alice',
            color: 'blue',
            routeCounts: {},
            destinationTickets: [],
          },
          {
            id: 'player-2',
            name: 'Bob',
            color: 'red',
            routeCounts: {},
            destinationTickets: [],
          },
        ],

        bonusInputsByPlayer: [],

        meepleCounts: [
          {
            playerId: 'player-1',
            counts: {
              red: 4,
              blue: 1,
            },
          },
          {
            playerId: 'player-2',
            counts: {
              red: 2,
              blue: 3,
            },
          },
        ],

        meepleConfig: {
          colors: ['red', 'blue'],
          majorityPoints: 20,
          secondPlacePoints: 10,
        },
      },
      scoringTable,
    )

    expect(result.scoredPlayers[0].score.meepleScore).toBe(30)
    expect(result.scoredPlayers[0].score.total).toBe(30)

    expect(result.scoredPlayers[1].score.meepleScore).toBe(30)
    expect(result.scoredPlayers[1].score.total).toBe(30)

    expect(result.standings[0].rank).toBe(1)
    expect(result.standings[1].rank).toBe(1)
  })

  it('returns empty results when there are no players', () => {
    const result = calculateCompleteGameScore(
      {
        players: [],
        bonusInputsByPlayer: [],
      },
      scoringTable,
    )

    expect(result).toEqual({
      scoredPlayers: [],
      standings: [],
    })
  })
})