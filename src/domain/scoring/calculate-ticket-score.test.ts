import { describe, expect, it } from 'vitest'

import { calculateDestinationTicketScore } from './calculate-ticket-score'
import type { DestinationTicketEntry } from './destination-ticket'

describe('calculateDestinationTicketScore', () => {
    
    it('calculates the correct total for multiple completed destination tickets', () => {
        const destinationTickets: DestinationTicketEntry[] = [
            { points: 7, completed: true },
            { points: 10, completed: true },
            { points: 4, completed: true },
        ]

        const result = calculateDestinationTicketScore(
            destinationTickets,
        )
        expect(result).toBe(21)
    })

    it('returns 0 when there are no destination tickets', () => {
        const destinationTickets: DestinationTicketEntry[] = []

        const result = calculateDestinationTicketScore(
            destinationTickets,
        )
        expect(result).toBe(0)
    })

    it('calculates the correct total for multiple failed tickets', () => {
        const destinationTickets: DestinationTicketEntry[] = [
            { points: 3, completed: false },
            { points: 10, completed: false },
            { points: 4, completed: false },
        ]

        const result = calculateDestinationTicketScore(
            destinationTickets,
        )
        expect(result).toBe(-17)
    })

    it('calculates the correct total for a mix of completed and failed tickets', () => {
        const destinationTickets: DestinationTicketEntry[] = [
            { points: 7, completed: true },
            { points: 10, completed: true },
            { points: 4, completed: true },
            { points: 4, completed: false },
        ]

        const result = calculateDestinationTicketScore(
            destinationTickets,
        )
        expect(result).toBe(17)
    })

    it('calculates the correct total for multiple tickets with same value completed', () => {
        const destinationTickets: DestinationTicketEntry[] = [
            { points: 7, completed: true },
            { points: 10, completed: true },
            { points: 4, completed: true },
            { points: 4, completed: true },
        ]

        const result = calculateDestinationTicketScore(
            destinationTickets,
        )
        expect(result).toBe(25)
    })

    it('returns 0 when tickets are a net-zero result', () => {
        const destinationTickets: DestinationTicketEntry[] = [
            { points: 4, completed: true },
            { points: 4, completed: false },
        ]

        const result = calculateDestinationTicketScore(
            destinationTickets,
        )
        expect(result).toBe(0)
    })
})