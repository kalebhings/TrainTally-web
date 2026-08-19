export interface PlayerRankedScoringData {
    rankedPoints: Record<string, number[]>
}

export interface MultipleRegionsScoringData {
    regionPoints: Record<string, number>
}

export interface BonusConfig {
    bonuses: Record<string, Bonus>
}

interface BonusBase {
    id: string
    displayName: string
    points: number
    description: string
    isExclusive: boolean
    isPerItem: boolean
    maxCount: number | null
}

export interface SimpleBonus extends BonusBase {
  scoringType: "simple"
}

export interface PlayerRankedBonus extends BonusBase {
  scoringType: "playerRanked"
  scoringData: PlayerRankedScoringData
}

export interface MultipleRegionsBonus extends BonusBase {
  scoringType: "multipleRegions"
  scoringData: MultipleRegionsScoringData
}

export type Bonus =
  | SimpleBonus
  | PlayerRankedBonus
  | MultipleRegionsBonus