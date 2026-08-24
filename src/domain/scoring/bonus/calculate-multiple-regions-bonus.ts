import type { MultipleRegionsBonus } from "./bonuses";

export function calculateMultipleRegionsBonus(
    bonus: MultipleRegionsBonus,
    completedRegionGroups: number[],
): number {
    let total = 0
    for (const regionGroup of completedRegionGroups) {
        const regionPoints = bonus.scoringData.regionPoints[regionGroup.toString()]
        if (regionPoints !== undefined) {
            total += regionPoints
        }
    }
    return total
}