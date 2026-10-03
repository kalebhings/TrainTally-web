import type { GameVersionIndex } from '../domain/game-version'

import { fetchJson } from './fetch-json'

export async function loadGameVersionIndex(): Promise<GameVersionIndex> {
    const data = await fetchJson('/data/game-versions-index.json')

    return data as GameVersionIndex
}