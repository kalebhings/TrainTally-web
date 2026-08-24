import type { Player } from "./player"
import type { RouteScoringEntry } from "../route/route-scoring"

import { calculateDestinationTicketScore } from "../ticket/calculate-ticket-score"
import { calculateRouteScore } from "../route/calculate-route-score"

export interface PlayerScore {
    routeScore: number
    destinationTicketScore: number
    bonusScore: number
    total: number
}

export function calculatePlayerScore(
    player: Player,
    scoringtable: RouteScoringEntry[],
    bonusScore: number,
): PlayerScore {
    const routeScore = calculateRouteScore(
        player.routeCounts,
        scoringtable
    )

    const destinationTicketScore = calculateDestinationTicketScore(
        player.destinationTickets
    )

    return {
        routeScore,
        destinationTicketScore,
        bonusScore,
        total: routeScore + destinationTicketScore + bonusScore,
    }
}