import type { GameVersion } from "../domain/game-version";
import { isGameVersion } from "./validate-game-version";

import { fetchJson } from './fetch-json'

export async function loadGameVersion(
    configFile: string,
): Promise<GameVersion> {
    const data = await fetchJson(`/data/${configFile}`)

    if (!isGameVersion(data)) {
        throw new Error('Invalid game version configuration')
    }

    return data
}