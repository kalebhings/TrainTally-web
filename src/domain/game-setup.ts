import type { GameVersion } from './game-version'

export interface PlayerSetup {
  id: string
  name: string
  color: string
}

export interface GameSetup {
  gameVersion: GameVersion
  players: PlayerSetup[]
}