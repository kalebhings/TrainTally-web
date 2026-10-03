import type { GameConfig } from '../game-config'
import type { PlayerSetup } from '../game-setup'
import type { SimpleBonus } from '../scoring/bonus/bonuses'
import type { PlayerBonusInputs } from '../scoring/bonus-resolution/bonus-resolution'
import type { CompleteGameScoreResult } from '../scoring/game/complete-game-score'
import type { Player } from '../scoring/player/player'
import type { PlayerEntry, ScoreEntry } from './score-entry'

import { mergePlayerBonusInputs } from '../scoring/bonus-resolution/merge-player-bonus-inputs'
import { resolveGlobetrotter } from '../scoring/bonus-resolution/resolve-globetrotter'
import { resolveManualBonus } from '../scoring/bonus-resolution/resolve-manual-bonus'
import { resolvePlayerRankedBonus } from '../scoring/bonus-resolution/resolve-player-ranked-bonus'
import { calculateCompleteGameScore } from '../scoring/game/calculate-complete-game-score'
import { trainCarsUsed } from './limits'
import { createPlayerEntry, EMPTY_RANKED_VALUE } from './score-entry'

export interface EntryIssue {
  playerId: string
  message: string
}

// Problems that must be fixed before a game can be finished.
export function entryIssues(
  players: PlayerSetup[],
  entry: ScoreEntry,
): EntryIssue[] {
  const issues: EntryIssue[] = []

  for (const player of players) {
    const used = trainCarsUsed(
      (entry.players[player.id] ?? createPlayerEntry()).routeCounts,
    )

    if (used > entry.limits.trainCarsPerPlayer) {
      issues.push({
        playerId: player.id,
        message: `${player.name} uses ${used} of ${entry.limits.trainCarsPerPlayer} train cars.`,
      })
    }
  }

  return issues
}

export function completedTicketCount(entry: PlayerEntry): number {
  return entry.tickets.filter((ticket) => ticket.completed).length
}

// Upper bound for a per-player count bonus, or null when unbounded.
export function bonusCountLimit(bonus: SimpleBonus): number | null {
  return bonus.maxCount
}

// Who would receive a "most completed tickets" bonus automatically,
// ignoring any manual override. Used as the starting point when
// the user switches to overriding it.
export function autoMostCompletedTicketsWinners(
  bonus: SimpleBonus,
  players: PlayerSetup[],
  entry: ScoreEntry,
): string[] {
  return resolveGlobetrotter(
    bonus,
    players.map((player) => ({
      playerId: player.id,
      completedTicketCount: completedTicketCount(
        entry.players[player.id] ?? createPlayerEntry(),
      ),
    })),
  )
    .filter((result) =>
      result.bonusInputs.some(
        (input) => 'count' in input && input.count > 0,
      ),
    )
    .map((result) => result.playerId)
}

function resolveSimpleBonus(
  bonus: SimpleBonus,
  players: PlayerSetup[],
  entry: ScoreEntry,
  entryFor: (playerId: string) => PlayerEntry,
): PlayerBonusInputs[] {
  const playerIds = players.map((player) => player.id)

  switch (bonus.entryMode) {
    case 'manualAward':
      return resolveManualBonus(
        bonus,
        playerIds,
        entry.manualAwards[bonus.id] ?? [],
      )

    case 'mostCompletedTickets':
      return resolveGlobetrotter(
        bonus,
        playerIds.map((playerId) => ({
          playerId,
          completedTicketCount: completedTicketCount(entryFor(playerId)),
        })),
        entry.awardOverrides[bonus.id],
      )

    case 'perPlayerCount': {
      const limit = bonusCountLimit(bonus) ?? Infinity

      return playerIds.map((playerId) => ({
        playerId,
        bonusInputs: [
          {
            bonus,
            count: Math.min(
              entryFor(playerId).bonusCounts[bonus.id] ?? 0,
              limit,
            ),
          },
        ],
      }))
    }
  }
}

// The single bridge between entered values and the scoring engine.
export function scoreGame(
  config: GameConfig,
  players: PlayerSetup[],
  entry: ScoreEntry,
): CompleteGameScoreResult {
  const entryFor = (playerId: string) =>
    entry.players[playerId] ?? createPlayerEntry()

  const bonusGroups: PlayerBonusInputs[][] = config.bonuses.map(
    (bonus) => {
      switch (bonus.scoringType) {
        case 'simple':
          return resolveSimpleBonus(bonus, players, entry, entryFor)

        case 'playerRanked':
          return resolvePlayerRankedBonus(
            bonus,
            players.map((player) => {
              const ranked =
                entryFor(player.id).rankedValues[bonus.id] ??
                EMPTY_RANKED_VALUE

              return {
                playerId: player.id,
                value: ranked.value,
                participated: ranked.participated,
              }
            }),
          )

        case 'multipleRegions':
          return players.map((player) => ({
            playerId: player.id,
            bonusInputs: [
              {
                bonus,
                completedRegionGroups:
                  entryFor(player.id).regionGroups[bonus.id] ?? [],
              },
            ],
          }))
      }
    },
  )

  const scoringPlayers: Player[] = players.map((player) => {
    const playerEntry = entryFor(player.id)

    return {
      id: player.id,
      name: player.name,
      color: player.color,
      routeCounts: playerEntry.routeCounts,
      destinationTickets: playerEntry.tickets,
    }
  })

  const meepleConfig = config.gameVersion.meepleConfig

  return calculateCompleteGameScore(
    {
      players: scoringPlayers,
      bonusInputsByPlayer: mergePlayerBonusInputs(bonusGroups),
      meepleConfig,
      meepleCounts: meepleConfig
        ? players.map((player) => ({
            playerId: player.id,
            counts: entryFor(player.id).meepleCounts,
          }))
        : undefined,
    },
    config.routeScoringTable,
  )
}