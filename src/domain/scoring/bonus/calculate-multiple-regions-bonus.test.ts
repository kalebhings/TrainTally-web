import { describe, expect, it } from 'vitest'

import type { MultipleRegionsBonus } from './bonuses'
import { calculateMultipleRegionsBonus } from './calculate-multiple-regions-bonus'

describe('calculateMultipleRegionsBonus', () => {
    const bonus: MultipleRegionsBonus = {
    id: 'connected_regions',
    displayName: 'Connected Regions',
    description: 'Number of consecutively connected regions',
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

  it('returns 0 when there are no completed region groups', () => {
    const result = calculateMultipleRegionsBonus(
      bonus,
      [],
    )

    expect(result).toBe(0)
  })

  it('calculates the score for one completed region group', () => {
    const result = calculateMultipleRegionsBonus(
      bonus,
      [8],
    )

    expect(result).toBe(7)
  })

  it('adds the scores for multiple completed region groups', () => {
    const result = calculateMultipleRegionsBonus(
      bonus,
      [5, 8],
    )

    expect(result).toBe(8)
  })

  it('adds the scores for several completed region groups', () => {
    const result = calculateMultipleRegionsBonus(
      bonus,
      [5, 8, 10],
    )

    expect(result).toBe(24)
  })

  it('returns 0 for unsupported region group sizes', () => {
    const result = calculateMultipleRegionsBonus(
      bonus,
      [3],
    )

    expect(result).toBe(0)
  })

  it('ignores unsupported region group sizes while scoring valid groups', () => {
    const result = calculateMultipleRegionsBonus(
      bonus,
      [5, 3, 8],
    )

    expect(result).toBe(8)
  })
})