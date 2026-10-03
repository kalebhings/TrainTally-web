import { describe, expect, it } from 'vitest'

import type { GameSetup } from '../game-setup'
import type { ScoreEntry } from './score-entry'

import { loadRealGameConfig } from '../../config/real-game-data'
import { createScoreEntry, scoreEntryReducer } from './score-entry'

const players = [
  { id: 'p1', name: 'Ann', color: 'red' },
  { id: 'p2', name: 'Bob', color: 'blue' },
]

// USA base: 45 train cars, default ticket cap of 40.
const setup: GameSetup = {
  config: loadRealGameConfig('usa_base'),
  players,
}

function apply(
  state: ScoreEntry,
  ...actions: Parameters<typeof scoreEntryReducer>[1][]
): ScoreEntry {
  return actions.reduce(scoreEntryReducer, state)
}

describe('scoreEntryReducer', () => {
  it('creates an empty entry for each player', () => {
    const state = createScoreEntry(setup)

    expect(Object.keys(state.players)).toEqual(['p1', 'p2'])
    expect(state.players.p1.tickets).toEqual([])
  })

  it('never lets route counts go below zero', () => {
    const state = apply(
      createScoreEntry(setup),
      { type: 'changeRouteCount', playerId: 'p1', length: 3, delta: 1 },
      { type: 'changeRouteCount', playerId: 'p1', length: 3, delta: -1 },
      { type: 'changeRouteCount', playerId: 'p1', length: 3, delta: -1 },
    )

    expect(state.players.p1.routeCounts[3]).toBe(0)
  })

  it('only changes the targeted player', () => {
    const initial = createScoreEntry(setup)
    const state = scoreEntryReducer(initial, {
      type: 'changeRouteCount',
      playerId: 'p1',
      length: 2,
      delta: 1,
    })

    expect(state.players.p2).toBe(initial.players.p2)
  })

  it('ignores actions for unknown players', () => {
    const initial = createScoreEntry(setup)

    expect(
      scoreEntryReducer(initial, {
        type: 'changeRouteCount',
        playerId: 'nobody',
        length: 2,
        delta: 1,
      }),
    ).toBe(initial)
  })

  it('adds, toggles, and removes tickets', () => {
    let state = apply(createScoreEntry(setup), {
      type: 'addTicket',
      playerId: 'p1',
      ticket: { id: 't1', points: 8, completed: true },
    })

    expect(state.players.p1.tickets).toEqual([
      { id: 't1', points: 8, completed: true },
    ])

    state = apply(state, { type: 'toggleTicket', playerId: 'p1', ticketId: 't1' })
    expect(state.players.p1.tickets[0].completed).toBe(false)

    state = apply(state, { type: 'removeTicket', playerId: 'p1', ticketId: 't1' })
    expect(state.players.p1.tickets).toEqual([])
  })

  it('only accepts whole ticket points from 1 to the cap', () => {
    const ticket = (id: string, points: number) => ({
      type: 'addTicket' as const,
      playerId: 'p1',
      ticket: { id, points, completed: true },
    })

    const state = apply(
      createScoreEntry(setup),
      ticket('zero', 0),
      ticket('nan', Number.NaN),
      ticket('fraction', 7.9),
      ticket('over', 41),
      ticket('huge', 280000),
      ticket('min', 1),
      ticket('max', 40),
    )

    expect(state.players.p1.tickets.map((t) => t.id)).toEqual(['min', 'max'])
  })

  it('refuses routes that would use more train cars than a player has', () => {
    const addSix = {
      type: 'changeRouteCount' as const,
      playerId: 'p1',
      length: 6,
      delta: 1,
    }

    // 7 six-car routes = 42 of 45 cars; an 8th would be 48.
    let state = apply(createScoreEntry(setup), ...Array(8).fill(addSix))

    expect(state.players.p1.routeCounts[6]).toBe(7)

    // 3 cars left: one 3-car route fits, a second does not.
    const addThree = { ...addSix, length: 3 }
    state = apply(state, addThree, addThree)

    expect(state.players.p1.routeCounts[3]).toBe(1)

    // Removing still works at the limit.
    state = apply(state, { ...addSix, delta: -1 })

    expect(state.players.p1.routeCounts[6]).toBe(6)
  })

  it('marks a ranked bonus as participated once a value is entered', () => {
    const state = apply(createScoreEntry(setup), {
      type: 'setRankedValue',
      playerId: 'p1',
      bonusId: 'bullet_train',
      value: 4,
    })

    expect(state.players.p1.rankedValues.bullet_train).toEqual({
      value: 4,
      participated: true,
    })
  })

  it('toggles manual awards and allows ties', () => {
    let state = apply(
      createScoreEntry(setup),
      { type: 'toggleManualAward', bonusId: 'longest_route', playerId: 'p1' },
      { type: 'toggleManualAward', bonusId: 'longest_route', playerId: 'p2' },
    )

    expect(state.manualAwards.longest_route).toEqual(['p1', 'p2'])

    state = apply(state, {
      type: 'toggleManualAward',
      bonusId: 'longest_route',
      playerId: 'p1',
    })

    expect(state.manualAwards.longest_route).toEqual(['p2'])
  })

  it('sets and clears award overrides', () => {
    let state = apply(createScoreEntry(setup), {
      type: 'setAwardOverride',
      bonusId: 'globetrotter',
      playerIds: [],
    })

    expect(state.awardOverrides.globetrotter).toEqual([])

    state = apply(state, { type: 'clearAwardOverride', bonusId: 'globetrotter' })

    expect('globetrotter' in state.awardOverrides).toBe(false)
  })

  it('adds and removes connected region groups', () => {
    const state = apply(
      createScoreEntry(setup),
      { type: 'addRegionGroup', playerId: 'p1', bonusId: 'regions', size: 5 },
      { type: 'addRegionGroup', playerId: 'p1', bonusId: 'regions', size: 8 },
      { type: 'removeRegionGroup', playerId: 'p1', bonusId: 'regions', index: 0 },
    )

    expect(state.players.p1.regionGroups.regions).toEqual([8])
  })
})