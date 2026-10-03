import type { RouteScoringConfig } from "../domain/scoring/route/route-scoring";

import { fetchJson } from './fetch-json'

export async function loadRouteScoring(): Promise<RouteScoringConfig> {
    const data = await fetchJson('/data/shared/route-scoring.json')

    return data as RouteScoringConfig
}