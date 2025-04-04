import {rateLimit} from 'express-rate-limit'

export const limiter = rateLimit({
    windowMs: 6 * 1000,
    limit: 5,
    message: {"error":"You has took the limit to make request"}
})