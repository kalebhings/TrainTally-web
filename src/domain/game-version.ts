export interface GameVersionIndexEntry {
  id: string
  displayName: string
  minPlayers: number
  maxPlayers: number
  configFile: string
}

export interface GameVersionIndexMetaData {
  version: string
  lastUpdated: string
}

export interface GameVersionIndex {
  versions: GameVersionIndexEntry[]
  metadata: GameVersionIndexMetaData
}

export interface GameVersionFeatures {
  hasStations: boolean
  hasMeeples: boolean
  hasFerries: boolean
  hasShips: boolean
}

export interface MeepleConfig {
  colors: string[]
  majorityPoints: number
  secondPlacePoints: number
}

export interface GameVersion {
  id: string
  displayName: string
  minPlayers: number
  maxPlayers: number
  trainCarsPerPlayer: number
  stationsPerPlayer: number | null
  playerColors: string[]
  routeScoring: string
  features: GameVersionFeatures
  bonuses: string[]
  meepleConfig: MeepleConfig | null
}