import { describe, expect, it } from 'vitest'

import type { PlayerSetup } from '../game-setup'
import type { ScoreEntry, ScoreEntryAction } from './score-entry'

import { loadRealGameConfig } from '../../config/real-game-data'
import { createScoreEntry, scoreEntryReducer } from './score-entry'
import { scoreLimits, trainCarsUsed } from './limits'
import {
  autoMostCompletedTicketsWinners,
  entryIssues,
  scoreGame,
} from './score-game'

const players: PlayerSetup[] = [
  { id: 'p1', name: 'Ann', color: 'red' },
  { id: 'p2', name: 'Bob', color: 'blue' },
  { id: 'p3', name: 'Cat', color: 'green' },
]

// Limits are wide open here so these tests only exercise scoring.
function entryWith(...actions: ScoreEntryAction[]): ScoreEntry {
  const empty = {
    ...createScoreEntry({ config: loadRealGameConfig('usa_base'), players }),
    limits: { trainCarsPerPlayer: Infinity, maxTicketPoints: Infinity },
  }

  return actions.reduce(scoreEntryReducer, empty)
}

function totals(versionId: string, entry: ScoreEntry) {
  const result = scoreGame(loadRealGameConfig(versionId), players, entry)

  return Object.fromEntries(
    result.scoredPlayers.map((scored) => [scored.player.id, scored.score]),
  )
}

function completedTicket(playerId: string, id: string): ScoreEntryAction {
  return {
    type: 'addTicket',
    playerId,
    ticket: { id, points: 5, completed: true },
  }
}

describe('scoreGame', () => {
  it('scores an empty game as zero for everyone', () => {
    const scores = totals('usa_1910', entryWith())

    expect(Object.values(scores).map((score) => score.total)).toEqual([0, 0, 0])
  })

  it('scores routes from the version table', () => {
    const scores = totals(
      'usa_base',
      entryWith(
        { type: 'changeRouteCount', playerId: 'p1', length: 6, delta: 1 },
        { type: 'changeRouteCount', playerId: 'p1', length: 3, delta: 2 },
      ),
    )

    expect(scores.p1.routeScore).toBe(15 + 4 * 2)
  })

  it('applies the Japan bullet train penalty to non-participants', () => {
    const scores = totals(
      'japan',
      entryWith(
        { type: 'setRankedValue', playerId: 'p1', bonusId: 'bullet_train', value: 6 },
        { type: 'setRankedValue', playerId: 'p2', bonusId: 'bullet_train', value: 3 },
      ),
    )

    expect(scores.p1.bonusScore).toBe(15)
    expect(scores.p2.bonusScore).toBe(5)
    expect(scores.p3.bonusScore).toBe(-20)
  })

  it('awards Globetrotter to everyone tied for most completed tickets', () => {
    const scores = totals(
      'france',
      entryWith(
        completedTicket('p1', 'a'),
        completedTicket('p2', 'b'),
      ),
    )

    expect(scores.p1.bonusScore).toBe(15)
    expect(scores.p2.bonusScore).toBe(15)
    expect(scores.p3.bonusScore).toBe(0)
  })

  it('uses the Globetrotter override instead of the automatic result', () => {
    const entry = entryWith(completedTicket('p1', 'a'), {
      type: 'setAwardOverride',
      bonusId: 'globetrotter',
      playerIds: ['p3'],
    })

    const scores = totals('old_west', entry)

    expect(scores.p1.bonusScore).toBe(0)
    expect(scores.p3.bonusScore).toBe(15)

    const config = loadRealGameConfig('old_west')
    const globetrotter = config.bonuses[0]

    if (globetrotter.scoringType !== 'simple') {
      throw new Error('Expected a simple bonus')
    }

    expect(
      autoMostCompletedTicketsWinners(globetrotter, players, entry),
    ).toEqual(['p1'])
  })

  it('awards Longest Route to every manually selected player', () => {
    const scores = totals(
      'usa_base',
      entryWith(
        { type: 'toggleManualAward', bonusId: 'longest_route', playerId: 'p1' },
        { type: 'toggleManualAward', bonusId: 'longest_route', playerId: 'p3' },
      ),
    )

    expect(scores.p1.bonusScore).toBe(10)
    expect(scores.p2.bonusScore).toBe(0)
    expect(scores.p3.bonusScore).toBe(10)
  })

  it('caps Europe unused stations at the bonus limit', () => {
    const scores = totals(
      'europe_base',
      entryWith({
        type: 'setBonusCount',
        playerId: 'p1',
        bonusId: 'unused_stations',
        count: 5,
      }),
    )

    expect(scores.p1.bonusScore).toBe(12)
  })

  it('scores Germany meeples by majority per color', () => {
    const scores = totals(
      'germany',
      entryWith(
        { type: 'changeMeepleCount', playerId: 'p1', color: 'red', delta: 3 },
        { type: 'changeMeepleCount', playerId: 'p2', color: 'red', delta: 1 },
      ),
    )

    expect(scores.p1.meepleScore).toBe(20)
    expect(scores.p2.meepleScore).toBe(10)
    expect(scores.p3.meepleScore).toBe(0)
  })

  it('scores Italy connected regions from the region table', () => {
    const scores = totals(
      'italy',
      entryWith(
        { type: 'addRegionGroup', playerId: 'p1', bonusId: 'connected_regions', size: 5 },
        { type: 'addRegionGroup', playerId: 'p1', bonusId: 'connected_regions', size: 8 },
      ),
    )

    expect(scores.p1.bonusScore).toBe(1 + 7)
    expect(scores.p1.meepleScore).toBe(0)
  })

  it('subtracts incomplete tickets and ranks players', () => {
    const result = scoreGame(
      loadRealGameConfig('usa_base'),
      players,
      entryWith(
        completedTicket('p2', 'a'),
        {
          type: 'addTicket',
          playerId: 'p3',
          ticket: { id: 'b', points: 9, completed: false },
        },
      ),
    )

    expect(
      result.standings.map((ranked) => [ranked.player.id, ranked.rank]),
    ).toEqual([
      ['p2', 1],
      ['p1', 2],
      ['p3', 3],
    ])
  })
})

describe('entryIssues', () => {
  it('reports players over the train car limit', () => {
    const entry = entryWith({
      type: 'changeRouteCount',
      playerId: 'p2',
      length: 6,
      delta: 8,
    })

    const limited = {
      ...entry,
      limits: scoreLimits(loadRealGameConfig('usa_base').gameVersion),
    }

    expect(entryIssues(players, limited)).toEqual([
      { playerId: 'p2', message: 'Bob uses 48 of 45 train cars.' },
    ])
    expect(entryIssues(players, entryWith())).toEqual([])
  })
})

describe('scoreLimits', () => {
  it('defaults the ticket cap and lets a version override it', () => {
    const { gameVersion } = loadRealGameConfig('usa_base')

    expect(scoreLimits(gameVersion).maxTicketPoints).toBe(40)
    expect(
      scoreLimits({ ...gameVersion, maxTicketPoints: 22 }).maxTicketPoints,
    ).toBe(22)
  })
})

describe('trainCarsUsed', () => {
  it('sums route length times count', () => {
    expect(trainCarsUsed({ 1: 2, 4: 3, 6: 1 })).toBe(2 + 12 + 6)
  })
})