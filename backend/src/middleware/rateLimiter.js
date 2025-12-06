import dotenv from 'dotenv';

dotenv.config();

const LIMIT = Number(process.env.RATE_LIMIT_COUNT) || 10;
const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) || 20_000; // 20 seconds default

// In-memory store: Map<string, number[]>
// Each key maps to a chronologically-ordered array of timestamps (ms)
const store = new Map();

function pruneOldEntries(timestamps, now) {
    const cutoff = now - WINDOW_MS;
    while (timestamps.length && timestamps[0] <= cutoff) {
        timestamps.shift();
    }
}

const rateLimiter = (req, res, next) => {
    try {
        // identify client: prefer X-Forwarded-For, then Express's req.ip, then remote address
        const forwarded = req.headers && (req.headers['x-forwarded-for'] || req.headers['X-Forwarded-For']);
        const ip = (forwarded && String(forwarded).split(',')[0].trim()) || req.ip || req.connection?.remoteAddress || 'global';
        const key = `rate:${ip}`;

        const now = Date.now();
        let timestamps = store.get(key);
        if (!timestamps) {
            timestamps = [];
            store.set(key, timestamps);
        }

        pruneOldEntries(timestamps, now);

        if (timestamps.length >= LIMIT) {
            const retryAfterMs = timestamps[0] + WINDOW_MS - now;
            const retryAfterSec = Math.max(0, Math.ceil(retryAfterMs / 1000));
            res.setHeader('Retry-After', String(retryAfterSec));
            return res.status(429).json({
                message: 'Too Many Requests, Please try again later!!',
            });
        }

        // Allow request and record timestamp
        timestamps.push(now);

        next();
    } catch (error) {
        console.log('Rate limit error', error);
        next(error);
    }
};

export default rateLimiter;