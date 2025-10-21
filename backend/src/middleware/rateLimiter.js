import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
    try {
        const { success } = await ratelimit.limit("my-rate-limit");
        
        if(!success) {
            return res.status(429).json({ //429 status code for too many requests
                message : "Too Many Requests, Please try again later!!",
            });
        }

        next();
    } catch (error) { // Catching any errors that occur during the size check
        console.log("Rate limit error", error);
        next(error);
    }
};

export default rateLimiter;