import { describe, expect, it } from 'vitest'

import type { PlayerSetup } from './game-setup'
import {
  finalizePlayers,
  hasValidPlayerColors,
  reassignColor,
  reconcilePlayers,
} from './game-setup'

const colors = ['red', 'blue', 'green']

// Always picks the first available option.
const firstRandom = () => 0

function player(id: string, color: string, name = ''): PlayerSetup {
  return { id, name, color }
}

describe('reconcilePlayers', () => {
  it('adds players with unique colors', () => {
    const result = reconcilePlayers([], 3, colors, firstRandom)

    expect(result).toHaveLength(3)
    expect(result.map((p) => p.color)).toEqual(['red', 'blue', 'green'])
  })

  it('keeps existing players and removes extras', () => {
    const players = [
      player('a', 'green', 'Ann'),
      player('b', 'red'),
      player('c', 'blue'),
    ]

    const result = reconcilePlayers(players, 2, colors, firstRandom)

    expect(result).toEqual([players[0], players[1]])
  })

  it('replaces colors that are invalid or duplicated', () => {
    const players = [
      player('a', 'purple'),
      player('b', 'blue'),
      player('c', 'blue'),
    ]

    const result = reconcilePlayers(players, 3, colors, firstRandom)

    expect(result.map((p) => p.color)).toEqual(['red', 'blue', 'green'])
  })

  it('keeps unchanged players as the same objects', () => {
    const players = [player('a', 'red')]

    const result = reconcilePlayers(players, 2, colors, firstRandom)

    expect(result[0]).toBe(players[0])
  })
})

describe('reassignColor', () => {
  it('sets an unused color directly', () => {
    const players = [player('a', 'red'), player('b', 'blue')]

    const result = reassignColor(players, 0, 'green', colors, firstRandom)

    expect(result.map((p) => p.color)).toEqual(['green', 'blue'])
  })

  it('gives the displaced player a random unused color', () => {
    const players = [player('a', 'red'), player('b', 'blue')]

    const result = reassignColor(players, 0, 'blue', colors, firstRandom)

    expect(result.map((p) => p.color)).toEqual(['blue', 'green'])
  })

  it('swaps colors when every color is taken', () => {
    const players = [
      player('a', 'red'),
      player('b', 'blue'),
      player('c', 'green'),
    ]

    const result = reassignColor(players, 0, 'green', colors, firstRandom)

    expect(result.map((p) => p.color)).toEqual(['green', 'blue', 'red'])
  })

  it('returns the same list when nothing changes', () => {
    const players = [player('a', 'red')]

    expect(reassignColor(players, 0, 'red', colors)).toBe(players)
  })
})

describe('finalizePlayers', () => {
  it('trims names and defaults blanks to Player N', () => {
    const players = [
      player('a', 'red', '  Ann  '),
      player('b', 'blue', '   '),
      player('c', 'green'),
    ]

    expect(finalizePlayers(players).map((p) => p.name)).toEqual([
      'Ann',
      'Player 2',
      'Player 3',
    ])
  })
})

describe('hasValidPlayerColors', () => {
  it('requires unique colors from the version palette', () => {
    expect(
      hasValidPlayerColors([player('a', 'red'), player('b', 'blue')], colors),
    ).toBe(true)

    expect(
      hasValidPlayerColors([player('a', 'red'), player('b', 'red')], colors),
    ).toBe(false)

    expect(
      hasValidPlayerColors([player('a', 'red'), player('b', '')], colors),
    ).toBe(false)
  })
})