import { describe, expect, it } from 'vitest'

import type { SimpleBonus } from '../bonus/bonuses'
import { resolveGlobetrotter } from './resolve-globetrotter'

describe('resolveGlobetrotter', () => {
  const bonus: SimpleBonus = {
    id: 'globetrotter',
    displayName: 'Globetrotter',
    description: 'Most completed destination tickets',
    scoringType: 'simple',
    points: 15,
    isExclusive: true,
    isPerItem: false,
    maxCount: null,
  }

  it('awards the player with the most completed tickets', () => {
    const result = resolveGlobetrotter(
      bonus,
      [
        { playerId: 'player-1', completedTicketCount: 3 },
        { playerId: 'player-2', completedTicketCount: 6 },
        { playerId: 'player-3', completedTicketCount: 4 },
      ],
    )

    expect(result[0].bonusInputs[0]).toEqual({
      bonus,
      count: 0,
    })

    expect(result[1].bonusInputs[0]).toEqual({
      bonus,
      count: 1,
    })

    expect(result[2].bonusInputs[0]).toEqual({
      bonus,
      count: 0,
    })
  })

  it('awards all players tied for the highest completed ticket count', () => {
    const result = resolveGlobetrotter(
      bonus,
      [
        { playerId: 'player-1', completedTicketCount: 5 },
        { playerId: 'player-2', completedTicketCount: 3 },
        { playerId: 'player-3', completedTicketCount: 5 },
      ],
    )

    expect(result[0].bonusInputs[0]).toEqual({
      bonus,
      count: 1,
    })

    expect(result[1].bonusInputs[0]).toEqual({
      bonus,
      count: 0,
    })

    expect(result[2].bonusInputs[0]).toEqual({
      bonus,
      count: 1,
    })
  })

  it('uses the manual override when supplied', () => {
    const result = resolveGlobetrotter(
      bonus,
      [
        { playerId: 'player-1', completedTicketCount: 10 },
        { playerId: 'player-2', completedTicketCount: 2 },
      ],
      ['player-2'],
    )

    expect(result[0].bonusInputs[0]).toEqual({
      bonus,
      count: 0,
    })

    expect(result[1].bonusInputs[0]).toEqual({
      bonus,
      count: 1,
    })
  })

  it('uses the manual override on multiple players when supplied', () => {
    const result = resolveGlobetrotter(
      bonus,
      [
        { playerId: 'player-1', completedTicketCount: 10 },
        { playerId: 'player-2', completedTicketCount: 2 },
        { playerId: 'player-3', completedTicketCount: 10 },
      ],
      ['player-1', 'player-3'],
    )

    expect(result[0].bonusInputs[0]).toEqual({
      bonus,
      count: 1,
    })

    expect(result[1].bonusInputs[0]).toEqual({
      bonus,
      count: 0,
    })

    expect(result[2].bonusInputs[0]).toEqual({
        bonus,
        count: 1,
    })
  })

  it('returns an empty array when there are no players', () => {
    const result = resolveGlobetrotter(
      bonus,
      [],
    )

    expect(result).toEqual([])
  })
})