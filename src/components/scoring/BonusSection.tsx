import type { Dispatch, ReactNode } from 'react'

import type { GameConfig } from '../../domain/game-config'
import type { PlayerSetup } from '../../domain/game-setup'
import type {
  MultipleRegionsBonus,
  PlayerRankedBonus,
  SimpleBonus,
} from '../../domain/scoring/bonus/bonuses'
import type {
  PlayerEntry,
  ScoreEntry,
  ScoreEntryAction,
} from '../../domain/score-entry/score-entry'
import type { ScoredPlayer } from '../../domain/scoring/game/game'

import {
  EMPTY_RANKED_VALUE,
  toggleId,
} from '../../domain/score-entry/score-entry'
import {
  autoMostCompletedTicketsWinners,
  bonusCountLimit,
  completedTicketCount,
} from '../../domain/score-entry/score-game'
import { capitalize, formatPoints, playerColorHex } from '../display'
import { Section } from '../Section'
import { Stepper } from '../Stepper'
import { Toggle } from '../Toggle'

interface BonusSectionProps {
  config: GameConfig
  players: PlayerSetup[]
  playerId: string
  playerEntry: PlayerEntry
  entry: ScoreEntry
  scored: ScoredPlayer
  dispatch: Dispatch<ScoreEntryAction>
}

export function BonusSection({
  config,
  players,
  playerId,
  playerEntry,
  entry,
  scored,
  dispatch,
}: BonusSectionProps) {
  const meepleConfig = config.gameVersion.meepleConfig
  const total = scored.score.bonusScore + scored.score.meepleScore

  if (config.bonuses.length === 0 && !meepleConfig) {
    return null
  }

  const pointsFor = (bonusId: string) =>
    scored.bonuses.find((bonus) => bonus.bonusId === bonusId)?.score ?? 0

  return (
    <Section
      title="Bonuses"
      aside={
        <span className="font-semibold tabular-nums text-orange-600">
          {formatPoints(total)} pts
        </span>
      }
    >
      <div className="divide-y divide-gray-100">
        {config.bonuses.map((bonus) => {
          const points = pointsFor(bonus.id)

          switch (bonus.scoringType) {
            case 'simple':
              return (
                <SimpleBonusControl
                  key={bonus.id}
                  bonus={bonus}
                  points={points}
                  players={players}
                  playerId={playerId}
                  playerEntry={playerEntry}
                  entry={entry}
                  dispatch={dispatch}
                />
              )

            case 'playerRanked':
              return (
                <RankedBonusControl
                  key={bonus.id}
                  bonus={bonus}
                  points={points}
                  playerId={playerId}
                  playerEntry={playerEntry}
                  dispatch={dispatch}
                />
              )

            case 'multipleRegions':
              return (
                <RegionsBonusControl
                  key={bonus.id}
                  bonus={bonus}
                  points={points}
                  playerId={playerId}
                  playerEntry={playerEntry}
                  dispatch={dispatch}
                />
              )
          }
        })}

        {meepleConfig && (
          <BonusRow
            title="Meeples"
            description={`Most of a color: ${meepleConfig.majorityPoints} pts, second: ${meepleConfig.secondPlacePoints} pts`}
            points={scored.score.meepleScore}
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {meepleConfig.colors.map((color) => (
                <div
                  key={color}
                  className="flex flex-col items-center gap-1 rounded-xl bg-gray-50 p-2"
                >
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <span
                      className="size-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: playerColorHex(color) }}
                    />
                    {capitalize(color)}
                  </span>
                  <Stepper
                    label={`${color} meeples`}
                    value={playerEntry.meepleCounts[color] ?? 0}
                    onChange={(delta) =>
                      dispatch({
                        type: 'changeMeepleCount',
                        playerId,
                        color,
                        delta,
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </BonusRow>
        )}
      </div>
    </Section>
  )
}

interface BonusRowProps {
  title: string
  description: string
  points: number
  children: ReactNode
}

function BonusRow({
  title,
  description,
  points,
  children,
}: BonusRowProps) {
  return (
    <div className="py-3 first:pt-0 last:pb-0">
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <span className="shrink-0 font-semibold tabular-nums">
          {formatPoints(points)}
        </span>
      </div>

      {children}
    </div>
  )
}

interface SimpleBonusControlProps {
  bonus: SimpleBonus
  points: number
  players: PlayerSetup[]
  playerId: string
  playerEntry: PlayerEntry
  entry: ScoreEntry
  dispatch: Dispatch<ScoreEntryAction>
}

function SimpleBonusControl({
  bonus,
  points,
  players,
  playerId,
  playerEntry,
  entry,
  dispatch,
}: SimpleBonusControlProps) {
  switch (bonus.entryMode) {
    case 'manualAward': {
      const awarded =
        entry.manualAwards[bonus.id]?.includes(playerId) ?? false

      return (
        <BonusRow
          title={bonus.displayName}
          description={`${bonus.description}. Ties: award each tied player.`}
          points={points}
        >
          <label className="flex items-center gap-3">
            <Toggle
              checked={awarded}
              label={`Award ${bonus.displayName}`}
              onChange={() =>
                dispatch({
                  type: 'toggleManualAward',
                  bonusId: bonus.id,
                  playerId,
                })
              }
            />
            <span className="text-sm">
              {awarded ? 'Awarded' : 'Not awarded'}
            </span>
          </label>
        </BonusRow>
      )
    }

    case 'mostCompletedTickets': {
      const override = entry.awardOverrides[bonus.id]
      const winners =
        override ??
        autoMostCompletedTicketsWinners(bonus, players, entry)
      const awarded = winners.includes(playerId)

      return (
        <BonusRow
          title={bonus.displayName}
          description={`${bonus.description}. ${completedTicketCount(playerEntry)} completed.`}
          points={points}
        >
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-3">
              <Toggle
                checked={awarded}
                label={`Award ${bonus.displayName}`}
                onChange={() =>
                  dispatch({
                    type: 'setAwardOverride',
                    bonusId: bonus.id,
                    playerIds: toggleId(winners, playerId),
                  })
                }
              />
              <span className="text-sm">
                {awarded ? 'Awarded' : 'Not awarded'}
              </span>
            </label>

            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                override
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {override ? 'Manual' : 'Auto'}
            </span>

            {override && (
              <button
                type="button"
                className="min-h-10 text-sm font-medium text-blue-600"
                onClick={() =>
                  dispatch({
                    type: 'clearAwardOverride',
                    bonusId: bonus.id,
                  })
                }
              >
                Reset to auto
              </button>
            )}
          </div>
        </BonusRow>
      )
    }

    case 'perPlayerCount':
      return (
        <BonusRow
          title={bonus.displayName}
          description={bonus.description}
          points={points}
        >
          <Stepper
            label={bonus.displayName}
            value={playerEntry.bonusCounts[bonus.id] ?? 0}
            max={bonusCountLimit(bonus)}
            onChange={(delta) =>
              dispatch({
                type: 'setBonusCount',
                playerId,
                bonusId: bonus.id,
                count: (playerEntry.bonusCounts[bonus.id] ?? 0) + delta,
              })
            }
          />
        </BonusRow>
      )
  }
}

interface RankedBonusControlProps {
  bonus: PlayerRankedBonus
  points: number
  playerId: string
  playerEntry: PlayerEntry
  dispatch: Dispatch<ScoreEntryAction>
}

function RankedBonusControl({
  bonus,
  points,
  playerId,
  playerEntry,
  dispatch,
}: RankedBonusControlProps) {
  const ranked =
    playerEntry.rankedValues[bonus.id] ?? EMPTY_RANKED_VALUE

  return (
    <BonusRow
      title={bonus.displayName}
      description={
        bonus.participationPenalty !== null
          ? `${bonus.description}. No participation: ${bonus.participationPenalty} pts.`
          : bonus.description
      }
      points={points}
    >
      <div className="flex flex-wrap items-center gap-4">
        <Stepper
          label={`${bonus.displayName} value`}
          value={ranked.value}
          onChange={(delta) =>
            dispatch({
              type: 'setRankedValue',
              playerId,
              bonusId: bonus.id,
              value: ranked.value + delta,
            })
          }
        />

        <label className="flex items-center gap-3">
          <Toggle
            checked={ranked.participated}
            label="Participated"
            onChange={(participated) =>
              dispatch({
                type: 'setRankedParticipation',
                playerId,
                bonusId: bonus.id,
                participated,
              })
            }
          />
          <span className="text-sm">Participated</span>
        </label>
      </div>
    </BonusRow>
  )
}

interface RegionsBonusControlProps {
  bonus: MultipleRegionsBonus
  points: number
  playerId: string
  playerEntry: PlayerEntry
  dispatch: Dispatch<ScoreEntryAction>
}

function RegionsBonusControl({
  bonus,
  points,
  playerId,
  playerEntry,
  dispatch,
}: RegionsBonusControlProps) {
  const regionPoints = bonus.scoringData.regionPoints
  const sizes = Object.keys(regionPoints)
    .map(Number)
    .sort((a, b) => a - b)
  const groups = playerEntry.regionGroups[bonus.id] ?? []

  return (
    <BonusRow
      title={bonus.displayName}
      description={`${bonus.description}. Tap a size to add a group.`}
      points={points}
    >
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            className="min-h-10 min-w-10 rounded-lg border border-gray-300 bg-white px-2 text-sm font-semibold tabular-nums"
            aria-label={`Add ${size}-region group`}
            onClick={() =>
              dispatch({
                type: 'addRegionGroup',
                playerId,
                bonusId: bonus.id,
                size,
              })
            }
          >
            {size}
          </button>
        ))}
      </div>

      {groups.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {groups.map((size, index) => (
            <li
              // Groups have no identity beyond position; duplicates are valid.
              key={`${index}-${size}`}
              className="flex items-center rounded-full bg-blue-50 text-sm font-medium text-blue-800"
            >
              <span className="py-1 pl-3">
                {size} regions · {formatPoints(regionPoints[size] ?? 0)}
              </span>
              <button
                type="button"
                className="min-h-10 px-3 opacity-60"
                aria-label={`Remove ${size}-region group`}
                onClick={() =>
                  dispatch({
                    type: 'removeRegionGroup',
                    playerId,
                    bonusId: bonus.id,
                    index,
                  })
                }
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </BonusRow>
  )
}