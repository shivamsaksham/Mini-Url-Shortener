import { NextFunction, Request, Response } from "express";

const rateLimits = new Map(); // Map to store rate limit data for each IP address
const WINDOW_SIZE = 60 * 1000; // 1 minute in milliseconds
const MAX_REQUESTS = 5; // Max requests per minute

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip; // getting user ip here 
    const currentTime = Date.now();

    if (!rateLimits.has(ip)) {
        rateLimits.set(ip, { count: 1, startTime: currentTime });
    } else {
        const userData = rateLimits.get(ip);

        if (currentTime - userData.startTime > WINDOW_SIZE) {
            rateLimits.delete(ip); // Cleanup expired entry if the time window has passed
            rateLimits.set(ip, { count: 1, startTime: currentTime });
        } else {
            userData.count++;
            if (userData.count > MAX_REQUESTS) {
                return res.status(429).send('Too many requests. Try again later.');
            }
            rateLimits.set(ip, userData); // Update count for the users ip
        }
    }
    next(); // Continue to the next route handler
};
