import { describe, expect, it } from 'vitest'

import type { SimpleBonus } from '../bonus/bonuses'
import { resolveManualBonus } from './resolve-manual-bonus'

describe('resolveManualBonus', () => {
  const bonus: SimpleBonus = {
    id: 'longest_route',
    displayName: 'Longest Route',
    description: 'Longest continuous path of trains',
    scoringType: 'simple',
    points: 10,
    entryMode: 'manualAward',
    isPerItem: false,
    maxCount: null,
  }

  it('awards the bonus to the selected player', () => {
    const result = resolveManualBonus(
      bonus,
      ['player-1', 'player-2', 'player-3'],
      ['player-2'],
    )

    expect(result).toEqual([
      {
        playerId: 'player-1',
        bonusInputs: [
          {
            bonus,
            count: 0,
          },
        ],
      },
      {
        playerId: 'player-2',
        bonusInputs: [
          {
            bonus,
            count: 1,
          },
        ],
      },
      {
        playerId: 'player-3',
        bonusInputs: [
          {
            bonus,
            count: 0,
          },
        ],
      },
    ])
  })

  it('awards no players when no player is selected', () => {
    const result = resolveManualBonus(
      bonus,
      ['player-1', 'player-2'],
      [],
    )

    expect(result).toEqual([
      {
        playerId: 'player-1',
        bonusInputs: [
          {
            bonus,
            count: 0,
          },
        ],
      },
      {
        playerId: 'player-2',
        bonusInputs: [
          {
            bonus,
            count: 0,
          },
        ],
      },
    ])
  })
})