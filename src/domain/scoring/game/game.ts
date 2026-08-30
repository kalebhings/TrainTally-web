import type { Player } from "../player/player"
import type {
    BonusScoreInput,
    BonusScoreResult,
} from "../bonus/calculate-bonus-score"
import type { PlayerScore } from "../player/calculate-player-score"

export interface PlayerGameScoreInput {
  player: Player
  bonusInputs: BonusScoreInput[]
  meepleScore?: number
}

export interface ScoredPlayer {
    player: Player
    score: PlayerScore
    bonuses: BonusScoreResult[]
}