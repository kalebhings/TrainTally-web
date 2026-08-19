import type { GameVersion } from "../domain/game-version";
import { isGameVersion } from "./validate-game-version";

export async function loadGameVersion(
    configFile: string,
): Promise<GameVersion> {
    const response = await fetch(`/data/${configFile}`)

    if (!response.ok) {
        throw new Error(`Failed to load game version: ${response.status}`)
    }

    const data: unknown = await response.json()

    if (!isGameVersion(data)) {
        throw new Error('Invalid game version configuration')
    }

    return data
}
    
