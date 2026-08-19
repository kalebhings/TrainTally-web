import type { RouteScoringConfig } from "../domain/scoring/route-scoring";

export async function loadRouteScoring(): Promise<RouteScoringConfig> {
    const response = await fetch('/data/shared/route-scoring.json')

    if (!response.ok) {
        throw new Error(
            `Failed to load route scoring config: ${response.status}`,
        )
    }

    const data: unknown = await response.json()

    return data as RouteScoringConfig
}