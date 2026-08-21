import type { DestinationTicketEntry } from "./destination-ticket"

export interface Player {
    id: string
    name: string
    color: string
    routeCounts: Record<number, number>
    destinationTickets: DestinationTicketEntry[]
}