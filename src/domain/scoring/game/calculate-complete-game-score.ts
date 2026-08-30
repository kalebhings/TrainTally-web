import type { RouteScoringEntry } from '../route/route-scoring'
import type {
  CompleteGameScoreInput,
  CompleteGameScoreResult,
} from './complete-game-score'

import { calculateMeepleScores } from '../meeple/calculate-meeple-scores'
import { calculateGameScore } from './calculate-game-score'
import { calculateStandings } from './calculate-standings'

export function calculateCompleteGameScore(
  input: CompleteGameScoreInput,
  scoringTable: RouteScoringEntry[],
): CompleteGameScoreResult {
  const meepleScores =
    input.meepleConfig && input.meepleCounts
      ? calculateMeepleScores(
          input.meepleCounts,
          input.meepleConfig,
        )
      : []

  const meepleScoreByPlayer = new Map(
    meepleScores.map((result) => [
      result.playerId,
      result.score,
    ]),
  )

  const bonusInputsByPlayer = new Map(
    input.bonusInputsByPlayer.map((result) => [
      result.playerId,
      result.bonusInputs,
    ]),
  )

  const gameScoreInputs = input.players.map((player) => ({
    player,
    bonusInputs:
      bonusInputsByPlayer.get(player.id) ?? [],
    meepleScore:
      meepleScoreByPlayer.get(player.id) ?? 0,
  }))

  const scoredPlayers = calculateGameScore(
    gameScoreInputs,
    scoringTable,
  )

  const standings = calculateStandings(scoredPlayers)

  return {
    scoredPlayers,
    standings,
  }
}