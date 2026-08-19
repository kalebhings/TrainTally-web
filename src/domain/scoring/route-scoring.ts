export interface RouteScoringEntry {
  length: number
  points: number
}

export interface RouteScoringConfig {
  scoringTables: Record<string, RouteScoringEntry[]>
}