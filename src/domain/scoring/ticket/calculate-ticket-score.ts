import type { DestinationTicketEntry } from "./destination-ticket"

export function calculateDestinationTicketScore(
    tickets: DestinationTicketEntry[],
): number {
    let total = 0
    for (const entry of tickets) {
        if (entry.completed === true) {
            total += entry.points
        } else {
            total -= entry.points
        }
    }
    return total
}