import type { BonusConfig } from '../domain/scoring/bonus/bonuses'

import { fetchJson } from './fetch-json'

export async function loadBonuses(): Promise<BonusConfig> {
    const data = await fetchJson('/data/shared/bonuses.json')

    return data as BonusConfig
}