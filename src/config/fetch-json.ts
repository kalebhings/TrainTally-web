const cache = new Map<string, Promise<unknown>>()

// Fetches a JSON file from /public once per session.
// Failed requests are evicted so a later call can retry.
export function fetchJson(path: string): Promise<unknown> {
    const cached = cache.get(path)

    if (cached) {
        return cached
    }

    const request = fetch(path).then(async (response) => {
        if (!response.ok) {
            throw new Error(`Failed to load ${path}: ${response.status}`)
        }

        return response.json() as Promise<unknown>
    })

    cache.set(path, request)

    request.catch(() => {
        cache.delete(path)
    })

    return request
}