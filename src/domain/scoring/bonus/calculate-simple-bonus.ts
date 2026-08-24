import type { SimpleBonus } from './bonuses'

export function calculateSimpleBonus(bonus: SimpleBonus, count: number): number {
    if (count <= 0) {
        return 0
    }
    
    if (!bonus.isPerItem) {
        return bonus.points
    }
    
    if (bonus.maxCount !== null) {
        const quantifier = Math.min(count, bonus.maxCount)
        return bonus.points * quantifier
    }
    return bonus.points * count
}