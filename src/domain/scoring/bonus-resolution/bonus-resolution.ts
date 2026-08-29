import type { BonusScoreInput } from "../bonus/calculate-bonus-score";

export interface PlayerBonusInputs {
    playerId: string
    bonusInputs: BonusScoreInput[]
}