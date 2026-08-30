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

    it('returns 0 for a player with no routes or tickets', () => {
        const player: Player = {
            id: 'player-2',
            name: 'Bob',
            color: 'red',
            routeCounts: {},
            destinationTickets: [],
        }

        const result = calculatePlayerScore(
            player,
            scoringTable,
            0
        )
        expect(result).toEqual({
            routeScore: 0,
            destinationTicketScore: 0,
            bonusScore: 0,
            meepleScore: 0,
            total: 0,
        })
    })

    it('combines a negative destination ticket score with a positive route score', () => {
        const player: Player = {
            id: 'player-2',
            name: 'Bob',
            color: 'red',
            routeCounts: {
                1: 1,
                3: 2,
                6: 1,
            },
            destinationTickets: [
                { points: 10, completed: false },
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
            destinationTicketScore: -4,
            bonusScore: 0,
            meepleScore: 0,
            total: 20,
        })
    })

    it('returns 0 for player with negative destination ticket cancelling out positive route score', () => {
        const player: Player = {
            id: 'player-2',
            name: 'Bob',
            color: 'red',
            routeCounts: {
                1: 1,
                3: 2,
                6: 1,
            },
            destinationTickets: [
                { points: 1, completed: false },
                { points: 8, completed: false },
                { points: 15, completed: false },
            ],
        }

        const result = calculatePlayerScore(
            player,
            scoringTable,
            0
        )
        expect(result).toEqual({
            routeScore: 24,
            destinationTicketScore: -24,
            bonusScore: 0,
            meepleScore: 0,
            total: 0,
        })
    })

    it('includes a positive bonus score in the total', () => {
        const player: Player = {
            id: 'player-3',
            name: 'Alice',
            color: 'green',
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
        )

        expect(result).toEqual({
            routeScore: 24,
            destinationTicketScore: 13,
            bonusScore: 10,
            meepleScore: 0,
            total: 47,
        })
    })

    it('includes a negative bonus score in the total', () => {
        const player: Player = {
            id: 'player-4',
            name: 'Charlie',
            color: 'yellow',
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
            -20,
        )

        expect(result).toEqual({
            routeScore: 24,
            destinationTicketScore: 13,
            bonusScore: -20,
            meepleScore: 0,
            total: 17,
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

    it('defaults meeple score to 0 when not provided', () => {
        const player: Player = {
            id: 'player-6',
            name: 'Evan',
            color: 'orange',
            routeCounts: {},
            destinationTickets: [],
        }

        const result = calculatePlayerScore(
            player,
            scoringTable,
            0,
        )

        expect(result.meepleScore).toBe(0)
    })
})