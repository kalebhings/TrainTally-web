import { describe, expect, it } from 'vitest'

import { resolveGameConfig } from './load-game-config'
import {
  readGameData as readData,
  realBonusConfig as bonusConfig,
  realIndex as index,
  realRouteScoringConfig as routeScoringConfig,
} from './real-game-data'
import { isGameVersion } from './validate-game-version'

describe('game data', () => {
  it.each(index.versions)('$id is a valid, resolvable version', (entry) => {
    const gameVersion = readData(entry.configFile)

    expect(isGameVersion(gameVersion)).toBe(true)

    if (!isGameVersion(gameVersion)) {
      return
    }

    expect(gameVersion.id).toBe(entry.id)
    expect(gameVersion.minPlayers).toBe(entry.minPlayers)
    expect(gameVersion.maxPlayers).toBe(entry.maxPlayers)
    expect(gameVersion.playerColors.length).toBeGreaterThanOrEqual(
      gameVersion.maxPlayers,
    )

    expect(() =>
      resolveGameConfig(gameVersion, bonusConfig, routeScoringConfig),
    ).not.toThrow()
  })

  it.each(Object.entries(bonusConfig.bonuses))(
    '%s has fields matching its scoring type',
    (id, bonus) => {
      expect(bonus.id).toBe(id)

      switch (bonus.scoringType) {
        case 'simple':
          expect([
            'manualAward',
            'mostCompletedTickets',
            'perPlayerCount',
          ]).toContain(bonus.entryMode)
          expect(typeof bonus.points).toBe('number')
          break
        case 'playerRanked':
          expect(typeof bonus.participationPenalty).toBe('number')
          expect(
            Object.keys(bonus.scoringData.rankedPoints).length,
          ).toBeGreaterThan(0)
          break
        case 'multipleRegions':
          expect(
            Object.keys(bonus.scoringData.regionPoints).length,
          ).toBeGreaterThan(0)
          break
        default:
          throw new Error(`Unknown scoring type for ${id}`)
      }
    },
  )

  it('rejects a version whose feature flags disagree with its config', () => {
    const italy = readData('versions/italy.json') as Record<string, unknown>

    expect(
      isGameVersion({
        ...italy,
        features: {
          ...(italy.features as object),
          hasMeeples: true,
        },
      }),
    ).toBe(false)
  })
})