import type { BonusConfig } from '../domain/scoring/bonus/bonuses'

export async function loadBonuses(): Promise<BonusConfig> {
    const response = await fetch('/data/shared/bonuses.json')

    if (!response.ok) {
        throw new Error(
            `Failed to load bonuses config: ${response.status}`,
        )
    }

    const data: unknown = await response.json()

    return data as BonusConfig
}