import type { GameConfig } from '../domain/game-config'
import type { GameVersion } from '../domain/game-version'
import type { BonusConfig } from '../domain/scoring/bonus/bonuses'
import type { RouteScoringConfig } from '../domain/scoring/route/route-scoring'

import { loadBonuses } from './load-bonuses'
import { loadGameVersion } from './load-game-version'
import { loadRouteScoring } from './load-route-scoring'

// Resolves a version's bonus ids and route table. Throws on missing
// references so bad config fails at setup instead of scoring as 0.
export function resolveGameConfig(
    gameVersion: GameVersion,
    bonusConfig: BonusConfig,
    routeScoringConfig: RouteScoringConfig,
): GameConfig {
    const bonuses = gameVersion.bonuses.map((bonusId) => {
        const bonus = bonusConfig.bonuses[bonusId]

        if (!bonus) {
            throw new Error(
                `${gameVersion.id}: unknown bonus "${bonusId}"`,
            )
        }

        return bonus
    })

    const routeScoringTable =
        routeScoringConfig.scoringTables[gameVersion.routeScoring]

    if (!routeScoringTable) {
        throw new Error(
            `${gameVersion.id}: unknown route scoring "${gameVersion.routeScoring}"`,
        )
    }

    return {
        gameVersion,
        bonuses,
        routeScoringTable,
    }
}

export async function loadGameConfig(
    configFile: string,
): Promise<GameConfig> {
    const [gameVersion, bonusConfig, routeScoringConfig] =
        await Promise.all([
            loadGameVersion(configFile),
            loadBonuses(),
            loadRouteScoring(),
        ])

    return resolveGameConfig(
        gameVersion,
        bonusConfig,
        routeScoringConfig,
    )
}