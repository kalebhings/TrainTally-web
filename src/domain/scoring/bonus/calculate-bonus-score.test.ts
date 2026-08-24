import { describe, expect, it } from 'vitest'

import type {
  SimpleBonus,
  MultipleRegionsBonus,
  PlayerRankedBonus,
} from './bonuses'

import {
  calculateBonusScore,
  calculateTotalBonusScore,
} from './calculate-bonus-score'

describe('calculateBonusScore', () => {
  const simpleBonus: SimpleBonus = {
    id: 'longest_route',
    displayName: 'Longest Route',
    points: 10,
    description: 'Longest continuous path of trains',
    isExclusive: true,
    isPerItem: false,
    maxCount: null,
    scoringType: 'simple',
  }

  const multipleRegionsBonus: MultipleRegionsBonus = {
    id: 'connected_regions',
    displayName: 'Connected Regions',
    points: 0,
    description: 'Number of consecutively connected regions',
    isExclusive: false,
    isPerItem: true,
    maxCount: null,
    scoringType: 'multipleRegions',
    scoringData: {
      regionPoints: {
        '5': 1,
        '6': 2,
        '7': 4,
        '8': 7,
        '9': 11,
        '10': 16,
      },
    },
  }

  const rankedBonus: PlayerRankedBonus = {
    id: 'bullet_train',
    displayName: 'Bullet Train Participation',
    points: 0,
    description: 'Bullet train participation ranking and player count',
    isExclusive: false,
    isPerItem: false,
    maxCount: null,
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

  it('calculates a simple bonus', () => {
    const result = calculateBonusScore({
      bonus: simpleBonus,
      count: 1,
    })

    expect(result).toEqual({
      bonusId: 'longest_route',
      score: 10,
    })
  })

  it('calculates a multiple regions bonus', () => {
    const result = calculateBonusScore({
      bonus: multipleRegionsBonus,
      completedRegionGroups: [5, 8],
    })

    expect(result).toEqual({
      bonusId: 'connected_regions',
      score: 8,
    })
  })

  it('calculates a player ranked bonus', () => {
    const result = calculateBonusScore({
      bonus: rankedBonus,
      playerCount: 4,
      rank: 2,
      participated: true,
    })

    expect(result).toEqual({
      bonusId: 'bullet_train',
      score: 10,
    })
  })

  it('calculates a participation penalty for a ranked bonus', () => {
    const result = calculateBonusScore({
      bonus: rankedBonus,
      playerCount: 4,
      rank: 1,
      participated: false,
    })

    expect(result).toEqual({
      bonusId: 'bullet_train',
      score: -20,
    })
  })
})

describe('calculateTotalBonusScore', () => {
  it('calculates the total score and preserves the bonus breakdown', () => {
    const simpleBonus: SimpleBonus = {
      id: 'longest_route',
      displayName: 'Longest Route',
      points: 10,
      description: 'Longest continuous path of trains',
      isExclusive: true,
      isPerItem: false,
      maxCount: null,
      scoringType: 'simple',
    }

    const multipleRegionsBonus: MultipleRegionsBonus = {
      id: 'connected_regions',
      displayName: 'Connected Regions',
      points: 0,
      description: 'Number of consecutively connected regions',
      isExclusive: false,
      isPerItem: true,
      maxCount: null,
      scoringType: 'multipleRegions',
      scoringData: {
        regionPoints: {
          '5': 1,
          '8': 7,
        },
      },
    }

    const result = calculateTotalBonusScore([
      {
        bonus: simpleBonus,
        count: 1,
      },
      {
        bonus: multipleRegionsBonus,
        completedRegionGroups: [5, 8],
      },
    ])

    expect(result.bonuses).toEqual([
      {
        bonusId: 'longest_route',
        score: 10,
      },
      {
        bonusId: 'connected_regions',
        score: 8,
      },
    ])

    expect(result.total).toBe(18)
  })

  it('returns zero for an empty bonus list', () => {
    const result = calculateTotalBonusScore([])

    expect(result).toEqual({
      bonuses: [],
      total: 0,
    })
  })
})