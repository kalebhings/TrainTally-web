import { describe, expect, it } from 'vitest'

import { calculateRouteScore } from './calculate-route-score'
import type { RouteScoringEntry } from './route-scoring'

describe('calculateRouteScore', () => {
    const standardScoringTable: RouteScoringEntry[] = [
        { length: 1, points: 1 },
        { length: 2, points: 2 },
        { length: 3, points: 4 },
        { length: 4, points: 7 },
        { length: 5, points: 10 },
        { length: 6, points: 15 },
    ]

    it('calculates the correct total for multiple route lengths', () => {
        const routeCounts: Record<number, number> = {
            1: 1,
            3: 2,
            6: 1,
        }

        const result = calculateRouteScore(
            routeCounts,
            standardScoringTable,
        )

        expect(result).toBe(24)
    })

    it('returns 0 when there are no routes', () => {
        const routeCounts: Record<number, number> = {}

        const result = calculateRouteScore(
            routeCounts,
            standardScoringTable,
        )
        expect(result).toBe(0)
    })

    it('handles multiple routes of the same length', () => {
        const routeCounts: Record<number, number> = {
            4: 3,
        }

        const result = calculateRouteScore(
            routeCounts,
            standardScoringTable,
        )
        expect(result).toBe(21)
    })

    it('treats missing route lengths as 0', () => {
        const routeCounts: Record<number, number> = {
            2: 2,
        }
        const result = calculateRouteScore(
            routeCounts,
            standardScoringTable,
        )
        expect(result).toBe(4)
    })
})