import { describe, expect, it } from "vitest";

import { calculatePlayerScore } from "./calculate-player-score";
import type { Player } from "./player";
import type { RouteScoringEntry } from "../route/route-scoring";


describe('calculatePlayerScore', () => {
    const scoringTable: RouteScoringEntry[] = [
        { length: 1, points: 1 },
        { length: 2, points: 2 },
        { length: 3, points: 4 },
        { length: 4, points: 7 },
        { length: 5, points: 10 },
        { length: 6, points: 15 },
        ]

    it('calculates route, destination ticket, and total score', () => {
        const player: Player = {
            id: 'player-1',
            name: 'Kaleb',
            color: 'blue',
            routeCounts: {
                1: 1,
                3: 2,
                6: 1,
            },
            destinationTickets: [
                { points: 7, completed: true },
                { points: 10, completed: true },
                { points: 4, completed: false },
            ],
        }

        const result = calculatePlayerScore(
            player,
            scoringTable,
            0
        )
        expect(result).toEqual({
            routeScore: 24,
            destinationTicketScore: 13,
            bonusScore: 0,
            meepleScore: 0,
            total: 37,
        })
    })

    it('includes meeple score in the total', () => {
        const player: Player = {
            id: 'player-5',
            name: 'Dana',
            color: 'purple',
            routeCounts: {
                1: 1,
                3: 2,
                6: 1,
            },
            destinationTickets: [
                { points: 7, completed: true },
                { points: 10, completed: true },
                { points: 4, completed: false },
            ],
        }

        const result = calculatePlayerScore(
            player,
            scoringTable,
            10,
            20,
        )

        expect(result).toEqual({
            routeScore: 24,
            destinationTicketScore: 13,
            bonusScore: 10,
            meepleScore: 20,
            total: 67,
        })
    })
})