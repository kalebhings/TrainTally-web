export interface PlayerRankedScoringData {
  rankedPoints: Record<string, number[]>
  noParticipationPenalty?: number
}

export interface MultipleRegionsScoringData {
    regionPoints: Record<string, number>
}

export interface BonusConfig {
    bonuses: Record<string, Bonus>
}

// TODO: Refactor shared bonus fields. See GitHub issue #1
interface BonusBase {
  id: string
  displayName: string
  description: string
}

export interface SimpleBonus extends BonusBase {
  scoringType: 'simple'
  points: number
  isExclusive: boolean
  isPerItem: boolean
  maxCount: number | null
}

export interface PlayerRankedBonus extends BonusBase {
  scoringType: "playerRanked"
  participationPenalty: number | null
  scoringData: PlayerRankedScoringData
}

export interface MultipleRegionsBonus extends BonusBase {
  scoringType: 'multipleRegions'
  scoringData: MultipleRegionsScoringData
}

export type Bonus =
  | SimpleBonus
  | PlayerRankedBonus
  | MultipleRegionsBonus