import { describe, expect, it } from "vitest";

import type { SimpleBonus } from "./bonuses";
import { calculateSimpleBonus } from "./calculate-simple-bonus";

describe('SimpleBonus', () => {

    const fixedBonus: SimpleBonus = {
        id: 'bonus-1',
        displayName: 'Fixed Bonus',
        points: 5,
        description: 'A fixed bonus',
        isExclusive: false,
        isPerItem: false,
        maxCount: null,
        scoringType: 'simple',
    }

    const perItemBonus: SimpleBonus = {
        id: 'bonus-2',
        displayName: 'Per Item Bonus',
        points: 5,
        description: 'A bonus per item',
        isExclusive: false,
        isPerItem: true,
        maxCount: 3,
        scoringType: 'simple',
    }

    it ('returns fixed bonus points when awarded', () => {
        const result = calculateSimpleBonus(fixedBonus, 1)
        expect(result).toEqual(5)
    })

    it ('returns 0 when bonus is not awarded', () => {
        const result = calculateSimpleBonus(fixedBonus, 0)
        expect(result).toEqual(0)
    })

    it ('returns points for each item when awarded per item', () => {
        const result = calculateSimpleBonus(perItemBonus, 2)
        expect(result).toEqual(10)
    })

    it ('respects maxCount when awarded per item', () => {
        const result = calculateSimpleBonus(perItemBonus, 5)
        expect(result).toEqual(15)
    })

    it ('returns points for each item when count is exactly maxCount', () => {
        const result = calculateSimpleBonus(perItemBonus, 3)
        expect(result).toEqual(15)
    })

    it ('returns 0 when count is 0 for per item bonus', () => {
        const result = calculateSimpleBonus(perItemBonus, 0)
        expect(result).toEqual(0)
    })

})