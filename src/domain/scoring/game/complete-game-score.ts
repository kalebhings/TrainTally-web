import type { Player } from '../player/player'
import type { PlayerBonusInputs } from '../bonus-resolution/bonus-resolution'
import type { PlayerMeepleCount } from '../meeple/meeple'
import type { MeepleConfig } from '../../game-version'
import type { ScoredPlayer } from './game'
import type { RankedPlayer } from './calculate-standings'

export interface CompleteGameScoreInput {
  players: Player[]
  bonusInputsByPlayer: PlayerBonusInputs[]
  meepleCounts?: PlayerMeepleCount[]
  meepleConfig?: MeepleConfig | null
}

export interface CompleteGameScoreResult {
  scoredPlayers: ScoredPlayer[]
  standings: RankedPlayer[]
}