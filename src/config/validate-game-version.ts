import type { GameVersion } from "../domain/game-version";

export function isGameVersion(value: unknown): value is GameVersion {
    if (typeof value !== 'object' || value === null) {
        return false
    }

    const candidate = value as Record<string, unknown>

    return (
        typeof candidate.id === 'string' &&
        typeof candidate.displayName === 'string' &&
        typeof candidate.minPlayers === 'number' &&
        typeof candidate.maxPlayers === 'number' &&
        typeof candidate.trainCarsPerPlayer === 'number'
    )
}