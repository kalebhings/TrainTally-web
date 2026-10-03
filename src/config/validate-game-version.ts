import type { GameVersion } from "../domain/game-version";

function isStringArray(value: unknown): value is string[] {
    return (
        Array.isArray(value) &&
        value.every((item) => typeof item === 'string')
    )
}

export function isGameVersion(value: unknown): value is GameVersion {
    if (typeof value !== 'object' || value === null) {
        return false
    }

    const candidate = value as Record<string, unknown>
    const features = candidate.features as Record<string, unknown> | undefined

    if (typeof features !== 'object' || features === null) {
        return false
    }

    // Feature flags must agree with the config they enable.
    const meeplesAreConsistent =
        features.hasMeeples === (candidate.meepleConfig != null)

    const stationsAreConsistent =
        features.hasStations ===
        (typeof candidate.stationsPerPlayer === 'number')

    const maxTicketPointsIsValid =
        candidate.maxTicketPoints === undefined ||
        (Number.isInteger(candidate.maxTicketPoints) &&
            (candidate.maxTicketPoints as number) > 0)

    return (
        typeof candidate.id === 'string' &&
        typeof candidate.displayName === 'string' &&
        typeof candidate.minPlayers === 'number' &&
        typeof candidate.maxPlayers === 'number' &&
        typeof candidate.trainCarsPerPlayer === 'number' &&
        typeof candidate.routeScoring === 'string' &&
        isStringArray(candidate.playerColors) &&
        isStringArray(candidate.bonuses) &&
        maxTicketPointsIsValid &&
        meeplesAreConsistent &&
        stationsAreConsistent
    )
}