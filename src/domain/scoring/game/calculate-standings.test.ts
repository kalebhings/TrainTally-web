import { describe, expect, it } from 'vitest'

import type { ScoredPlayer } from './game'
import { calculateStandings } from './calculate-standings'

describe('calculateStandings', () => {
  const createScoredPlayer = (
    id: string,
    name: string,
    total: number,
  ): ScoredPlayer => ({
    player: {
      id,
      name,
      color: 'blue',
      routeCounts: {},
      destinationTickets: [],
    },
    score: {
      routeScore: total,
      destinationTicketScore: 0,
      bonusScore: 0,
      total,
    },
    bonuses: [],
  })

  it('sorts players by total score from highest to lowest', () => {
    const players = [
      createScoredPlayer('player-1', 'Alice', 50),
      createScoredPlayer('player-2', 'Bob', 80),
      createScoredPlayer('player-3', 'Charlie', 30),
    ]

    const result = calculateStandings(players)

    expect(result.map((player) => player.player.name)).toEqual([
      'Bob',
      'Alice',
      'Charlie',
    ])

    expect(result.map((player) => player.rank)).toEqual([
      1,
      2,
      3,
    ])
  })

  it('gives tied players the same rank', () => {
    const players = [
      createScoredPlayer('player-1', 'Alice', 100),
      createScoredPlayer('player-2', 'Bob', 90),
      createScoredPlayer('player-3', 'Charlie', 90),
      createScoredPlayer('player-4', 'Diana', 80),
    ]

    const result = calculateStandings(players)

    expect(result.map((player) => player.rank)).toEqual([
      1,
      2,
      2,
      4,
    ])
  })

  it('sorts tied players alphabetically by name', () => {
    const players = [
      createScoredPlayer('player-1', 'Charlie', 90),
      createScoredPlayer('player-2', 'Bob', 90),
      createScoredPlayer('player-3', 'Alice', 100),
    ]

    const result = calculateStandings(players)

    expect(result.map((player) => player.player.name)).toEqual([
      'Alice',
      'Bob',
      'Charlie',
    ])
  })

  it('handles multiple players tied for the same rank', () => {
    const players = [
      createScoredPlayer('player-1', 'Alice', 100),
      createScoredPlayer('player-2', 'David', 90),
      createScoredPlayer('player-3', 'Bob', 90),
      createScoredPlayer('player-4', 'Charlie', 90),
      createScoredPlayer('player-5', 'Eve', 80),
    ]

    const result = calculateStandings(players)

    expect(result.map((player) => player.player.name)).toEqual([
      'Alice',
      'Bob',
      'Charlie',
      'David',
      'Eve',
    ])

    expect(result.map((player) => player.rank)).toEqual([
      1,
      2,
      2,
      2,
      5,
    ])
  })

  it('handles zero and negative scores', () => {
    const players = [
      createScoredPlayer('player-1', 'Alice', -10),
      createScoredPlayer('player-2', 'Bob', 0),
      createScoredPlayer('player-3', 'Charlie', -20),
    ]

    const result = calculateStandings(players)

    expect(result.map((player) => player.player.name)).toEqual([
      'Bob',
      'Alice',
      'Charlie',
    ])
  })

  it('returns an empty array when there are no players', () => {
    expect(calculateStandings([])).toEqual([])
  })
})