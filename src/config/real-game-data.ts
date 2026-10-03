// Test-only helpers that read the real files in public/data.
import type { GameConfig } from '../domain/game-config'
import type { GameVersion, GameVersionIndex } from '../domain/game-version'
import type { BonusConfig } from '../domain/scoring/bonus/bonuses'
import type { RouteScoringConfig } from '../domain/scoring/route/route-scoring'

import { resolveGameConfig } from './load-game-config'

const dataFiles = import.meta.glob<unknown>(
  '../../public/data/**/*.json',
  { eager: true, import: 'default' },
)

export function readGameData(path: string): unknown {
  const key = `../../public/data/${path}`

  if (!(key in dataFiles)) {
    throw new Error(`Missing game data file ${path}`)
  }

  return structuredClone(dataFiles[key])
}

export const realIndex =
  readGameData('game-versions-index.json') as GameVersionIndex

export const realBonusConfig =
  readGameData('shared/bonuses.json') as BonusConfig

export const realRouteScoringConfig =
  readGameData('shared/route-scoring.json') as RouteScoringConfig

export function loadRealGameConfig(versionId: string): GameConfig {
  const entry = realIndex.versions.find((version) => version.id === versionId)

  if (!entry) {
    throw new Error(`Unknown version ${versionId}`)
  }

  return resolveGameConfig(
    readGameData(entry.configFile) as GameVersion,
    realBonusConfig,
    realRouteScoringConfig,
  )
}
