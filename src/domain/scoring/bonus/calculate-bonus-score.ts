import { calculateSimpleBonus } from "./calculate-simple-bonus";
import { calculateMultipleRegionsBonus } from "./calculate-multiple-regions-bonus";
import { calculatePlayerRankedBonus } from "./calculate-player-ranked-bonus";

import type {
    SimpleBonus,
    MultipleRegionsBonus,
    PlayerRankedBonus,
} from "./bonuses";

export type BonusScoreInput = 
    | {
        bonus: SimpleBonus
        count: number
    }
    | {
        bonus: MultipleRegionsBonus
        completedRegionGroups: number[]
    }
    | {
        bonus: PlayerRankedBonus
        playerCount: number
        rank: number
        participated: boolean
    }

export interface BonusScoreResult {
  bonusId: string
  score: number
}

export function calculateBonusScore(
  input: BonusScoreInput,
): BonusScoreResult {
  let score = 0

  if ("count" in input) {
    score = calculateSimpleBonus(
      input.bonus,
      input.count,
    )
  } else if ("completedRegionGroups" in input) {
    score = calculateMultipleRegionsBonus(
      input.bonus,
      input.completedRegionGroups,
    )
  } else {
    score = calculatePlayerRankedBonus(
      input.bonus,
      input.playerCount,
      input.rank,
      input.participated,
    )
  }

  return {
    bonusId: input.bonus.id,
    score,
  }
}

export interface TotalBonusScore {
  bonuses: BonusScoreResult[]
  total: number
}

export function calculateTotalBonusScore(
  inputs: BonusScoreInput[],
): TotalBonusScore {
  const bonuses = inputs.map(calculateBonusScore)

  const total = bonuses.reduce(
    (sum, bonus) => sum + bonus.score,
    0,
  )

  return {
    bonuses,
    total,
  }
}