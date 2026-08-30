import { describe, expect, it } from 'vitest'

import type { MeepleConfig } from '../../game-version'
import { calculateMeepleScores } from './calculate-meeple-scores'

describe('calculateMeepleScores', () => {
  const config: MeepleConfig = {
    colors: ['red', 'blue'],
    majorityPoints: 20,
    secondPlacePoints: 10,
  }

  it('awards first and second place for a color', () => {
    const result = calculateMeepleScores(
      [
        {
          playerId: 'player-1',
          counts: {
            red: 4,
            blue: 0,
          },
        },
        {
          playerId: 'player-2',
          counts: {
            red: 2,
            blue: 0,
          },
        },
        {
          playerId: 'player-3',
          counts: {
            red: 1,
            blue: 0,
          },
        },
      ],
      config,
    )

    expect(result).toEqual([
      {
        playerId: 'player-1',
        score: 20,
      },
      {
        playerId: 'player-2',
        score: 10,
      },
      {
        playerId: 'player-3',
        score: 0,
      },
    ])
  })

  it('awards majority points to all players tied for first and no second-place points', () => {
    const result = calculateMeepleScores(
      [
        {
          playerId: 'player-1',
          counts: {
            red: 4,
            blue: 0,
          },
        },
        {
          playerId: 'player-2',
          counts: {
            red: 4,
            blue: 0,
          },
        },
        {
          playerId: 'player-3',
          counts: {
            red: 2,
            blue: 0,
          },
        },
      ],
      config,
    )

    expect(result).toEqual([
      {
        playerId: 'player-1',
        score: 20,
      },
      {
        playerId: 'player-2',
        score: 20,
      },
      {
        playerId: 'player-3',
        score: 0,
      },
    ])
  })

  it('awards second-place points to all players tied for second', () => {
    const result = calculateMeepleScores(
      [
        {
          playerId: 'player-1',
          counts: {
            red: 5,
            blue: 0,
          },
        },
        {
          playerId: 'player-2',
          counts: {
            red: 3,
            blue: 0,
          },
        },
        {
          playerId: 'player-3',
          counts: {
            red: 3,
            blue: 0,
          },
        },
      ],
      config,
    )

    expect(result).toEqual([
      {
        playerId: 'player-1',
        score: 20,
      },
      {
        playerId: 'player-2',
        score: 10,
      },
      {
        playerId: 'player-3',
        score: 10,
      },
    ])
  })

  it('adds scores across multiple meeple colors', () => {
    const result = calculateMeepleScores(
      [
        {
          playerId: 'player-1',
          counts: {
            red: 5,
            blue: 2,
          },
        },
        {
          playerId: 'player-2',
          counts: {
            red: 3,
            blue: 4,
          },
        },
        {
          playerId: 'player-3',
          counts: {
            red: 1,
            blue: 3,
          },
        },
      ],
      config,
    )

    expect(result).toEqual([
      {
        playerId: 'player-1',
        score: 20,
      },
      {
        playerId: 'player-2',
        score: 30,
      },
      {
        playerId: 'player-3',
        score: 10,
      },
    ])
  })

  it('does not award points to players with zero meeples', () => {
    const result = calculateMeepleScores(
      [
        {
          playerId: 'player-1',
          counts: {
            red: 3,
            blue: 0,
          },
        },
        {
          playerId: 'player-2',
          counts: {
            red: 0,
            blue: 0,
          },
        },
      ],
      config,
    )

    expect(result).toEqual([
      {
        playerId: 'player-1',
        score: 20,
      },
      {
        playerId: 'player-2',
        score: 0,
      },
    ])
  })

  it('returns zero scores when no meeples were collected', () => {
    const result = calculateMeepleScores(
      [
        {
          playerId: 'player-1',
          counts: {
            red: 0,
            blue: 0,
          },
        },
        {
          playerId: 'player-2',
          counts: {
            red: 0,
            blue: 0,
          },
        },
      ],
      config,
    )

    expect(result).toEqual([
      {
        playerId: 'player-1',
        score: 0,
      },
      {
        playerId: 'player-2',
        score: 0,
      },
    ])
  })

  it('returns an empty array when there are no players', () => {
    const result = calculateMeepleScores(
      [],
      config,
    )

    expect(result).toEqual([])
  })
})