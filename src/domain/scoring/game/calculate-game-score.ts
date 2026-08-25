import type { RouteScoringEntry } from "../route/route-scoring";
import type {
    PlayerGameScoreInput,
    ScoredPlayer,
} from "./game"

import { calculateTotalBonusScore } from "../bonus/calculate-bonus-score";
import { calculatePlayerScore } from "../player/calculate-player-score";

export function calculateGameScore(
    players: PlayerGameScoreInput[],
    scoringTable: RouteScoringEntry[],
): ScoredPlayer[] {
    
    return players.map((playerInput) => {
        const bonusScore = calculateTotalBonusScore(
            playerInput.bonusInputs,
        )

        const score = calculatePlayerScore(
            playerInput.player,
            scoringTable,
            bonusScore.total
        )

        return {
            player: playerInput.player,
            score,
            bonuses: bonusScore.bonuses
        }
    })
}