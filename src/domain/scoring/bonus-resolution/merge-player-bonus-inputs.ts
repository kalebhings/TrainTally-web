import type { PlayerBonusInputs } from './bonus-resolution'

export function mergePlayerBonusInputs(
  groups: PlayerBonusInputs[][],
): PlayerBonusInputs[] {
  const merged = new Map<string, PlayerBonusInputs>()

  for (const group of groups) {
    for (const player of group) {
      const existing = merged.get(player.playerId)

      if (existing) {
        existing.bonusInputs.push(...player.bonusInputs)
      } else {
        merged.set(player.playerId, {
          playerId: player.playerId,
          bonusInputs: [...player.bonusInputs],
        })
      }
    }
  }

  return Array.from(merged.values())
}