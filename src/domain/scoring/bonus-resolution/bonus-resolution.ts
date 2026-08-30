import type { BonusScoreInput } from "../bonus/calculate-bonus-score";

export interface PlayerBonusInputs {
    playerId: string
    bonusInputs: BonusScoreInput[]
}

export interface PlayerCompletedTicketCount {
  playerId: string
  completedTicketCount: number
}

export interface PlayerRankedValue {
  playerId: string
  value: number
  participated: boolean
}