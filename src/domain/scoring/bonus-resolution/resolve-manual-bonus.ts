import type { SimpleBonus } from "../bonus/bonuses";
import type { PlayerBonusInputs } from "./bonus-resolution";

export function resolveManualBonus(
    bonus: SimpleBonus,
    playerIds: string[],
    awardedPlayerIds: string[],
): PlayerBonusInputs[] {
    const results: PlayerBonusInputs[] = []

    for (const playerId of playerIds) {
        const awarded = awardedPlayerIds.includes(playerId)

        results.push({
            playerId,
            bonusInputs: [
                {
                    bonus,
                    count: awarded ? 1 : 0,
                },
            ],
        })
    }

    return results
}