import type { Player } from "./player"
import type { RouteScoringEntry } from "./route-scoring"

import { calculateDestinationTicketScore } from "./calculate-ticket-score"
import { calculateRouteScore } from "./calculate-route-score"

export interface PlayerScore {
    routeScore: number
    destinationTicketScore: number
    total: number
}

export function calculatePlayerScore(
    player: Player,
    scoringtable: RouteScoringEntry[],
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
        total: routeScore + destinationTicketScore,
    }
}