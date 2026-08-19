import type { RouteScoringEntry } from "./route-scoring"

export function calculateRouteScore(
    routeCounts: Record<number, number>,
    scoringTable: RouteScoringEntry[],
): number {
    let total = 0
    for (const entry of scoringTable) {
        const count = routeCounts[entry.length] ?? 0
        total += count * entry.points
    }
    return total
}