
const LIMIT = 10;
const WINDOW_MS = 20_000; // 20 seconds default

// In-memory store: Map<string, number[]>
// Each key maps to a chronologically-ordered array of timestamps (ms)
const store = new Map();

function pruneOldEntries(timestamps, now) {
    const cutoff = now - WINDOW_MS;
    // remove older entries at front while they are older than cutoff
    while (timestamps.length && timestamps[0] <= cutoff) {
        timestamps.shift();
    }
}

const ratelimit = {
    // Async to keep compatibility with previous Upstash-based API
    async limit(key = 'global') {
        const now = Date.now();
        let timestamps = store.get(key);
        if (!timestamps) {
            timestamps = [];
            store.set(key, timestamps);
        }

        pruneOldEntries(timestamps, now);

        if (timestamps.length >= LIMIT) {
            // Too many requests in window
            const retryAfterMs = timestamps[0] + WINDOW_MS - now;
            return {
                success: false,
                retryAfter: Math.max(0, Math.ceil(retryAfterMs / 1000)), // seconds
                remaining: 0,
            };
        }

        // Allow request and record timestamp
        timestamps.push(now);

        return {
            success: true,
            remaining: Math.max(0, LIMIT - timestamps.length),
        };
    },

    // Expose internals for testing or inspection (not intended for production use)
    _store: store,
    _config: { LIMIT, WINDOW_MS },
};

export default ratelimit;