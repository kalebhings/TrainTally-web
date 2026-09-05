import type { GameVersion } from './game-version'

export interface PlayerSetup {
  name: string
  color: string
}

export interface GameSetup {
  gameVersion: GameVersion
  players: PlayerSetup[]
}