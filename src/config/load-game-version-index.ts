import type { GameVersionIndex } from '../domain/game-version'

export async function loadGameVersionIndex(): Promise<GameVersionIndex> {
    const response = await fetch('/data/game-versions-index.json')

    if (!response.ok) {
        throw new Error(`Failed to load game version index: ${response.status}`)
    }
    const data: unknown = await response.json()

    return data as GameVersionIndex
}