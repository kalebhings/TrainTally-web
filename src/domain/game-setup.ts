import type { GameConfig } from './game-config'

export interface PlayerSetup {
  id: string
  name: string
  color: string
}

export interface GameSetup {
  config: GameConfig
  players: PlayerSetup[]
}

type RandomFn = () => number

function pickRandom<T>(
  items: T[],
  random: RandomFn,
): T | undefined {
  if (items.length === 0) {
    return undefined
  }

  return items[Math.floor(random() * items.length)]
}

export function createPlayerSetup(): PlayerSetup {
  return {
    id: crypto.randomUUID(),
    name: '',
    color: '',
  }
}

// Resizes the player list to `count`, keeping existing players and
// making sure every player has a valid color no one else is using.
export function reconcilePlayers(
  players: PlayerSetup[],
  count: number,
  colors: string[],
  random: RandomFn = Math.random,
): PlayerSetup[] {
  const nextPlayers = players.slice(0, count)

  while (nextPlayers.length < count) {
    nextPlayers.push(createPlayerSetup())
  }

  const usedColors = new Set<string>()

  return nextPlayers.map((player) => {
    if (
      colors.includes(player.color) &&
      !usedColors.has(player.color)
    ) {
      usedColors.add(player.color)
      return player
    }

    const newColor =
      pickRandom(
        colors.filter((color) => !usedColors.has(color)),
        random,
      ) ?? ''

    if (newColor) {
      usedColors.add(newColor)
    }

    return { ...player, color: newColor }
  })
}

// Gives player `index` the chosen color. If someone else already has
// it, they get a random unused color, or swap if none are left.
export function reassignColor(
  players: PlayerSetup[],
  index: number,
  newColor: string,
  colors: string[],
  random: RandomFn = Math.random,
): PlayerSetup[] {
  const currentColor = players[index]?.color

  if (currentColor === undefined || currentColor === newColor) {
    return players
  }

  const conflictingIndex = players.findIndex(
    (player, playerIndex) =>
      playerIndex !== index && player.color === newColor,
  )

  let displacedColor = currentColor

  if (conflictingIndex !== -1) {
    const usedColors = new Set(players.map((player) => player.color))

    displacedColor =
      pickRandom(
        colors.filter((color) => !usedColors.has(color)),
        random,
      ) ?? currentColor
  }

  return players.map((player, playerIndex) => {
    if (playerIndex === index) {
      return { ...player, color: newColor }
    }

    if (playerIndex === conflictingIndex) {
      return { ...player, color: displacedColor }
    }

    return player
  })
}

export function defaultPlayerName(index: number): string {
  return `Player ${index + 1}`
}

// Trims names and fills blanks with "Player N".
export function finalizePlayers(
  players: PlayerSetup[],
): PlayerSetup[] {
  return players.map((player, index) => ({
    ...player,
    name: player.name.trim() || defaultPlayerName(index),
  }))
}

export function hasValidPlayerColors(
  players: PlayerSetup[],
  colors: string[],
): boolean {
  return (
    players.every((player) => colors.includes(player.color)) &&
    new Set(players.map((player) => player.color)).size === players.length
  )
}