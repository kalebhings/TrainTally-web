import type { GameVersion } from './game-version'
import type { Bonus } from './scoring/bonus/bonuses'
import type { RouteScoringEntry } from './scoring/route/route-scoring'

// Everything needed to score one game, fully resolved.
export interface GameConfig {
  gameVersion: GameVersion
  bonuses: Bonus[]
  routeScoringTable: RouteScoringEntry[]
}
