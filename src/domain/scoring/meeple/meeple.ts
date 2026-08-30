export interface PlayerMeepleCount {
  playerId: string
  counts: Record<string, number>
}

export interface PlayerMeepleScore {
  playerId: string
  score: number
}