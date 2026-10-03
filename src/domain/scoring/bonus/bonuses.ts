export interface PlayerRankedScoringData {
  rankedPoints: Record<string, number[]>
}

export interface MultipleRegionsScoringData {
    regionPoints: Record<string, number>
}

export interface BonusConfig {
    bonuses: Record<string, Bonus>
}

// How a simple bonus is entered during scoring:
// - manualAward: players pick the winner(s), e.g. Longest Route
// - mostCompletedTickets: awarded automatically from tickets, with manual override
// - perPlayerCount: each player enters a count, e.g. unused stations
export type SimpleBonusEntryMode =
  | 'manualAward'
  | 'mostCompletedTickets'
  | 'perPlayerCount'

// TODO: Refactor shared bonus fields. See GitHub issue #1
interface BonusBase {
  id: string
  displayName: string
  description: string
}

export interface SimpleBonus extends BonusBase {
  scoringType: 'simple'
  entryMode: SimpleBonusEntryMode
  points: number
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