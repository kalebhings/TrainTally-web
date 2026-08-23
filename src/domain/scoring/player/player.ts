import type { DestinationTicketEntry } from "../ticket/destination-ticket"

export interface Player {
    id: string
    name: string
    color: string
    routeCounts: Record<number, number>
    destinationTickets: DestinationTicketEntry[]
}