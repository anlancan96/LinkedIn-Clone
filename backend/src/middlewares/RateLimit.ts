import { Application, Request } from 'express';
import { rateLimit } from "express-rate-limit";
import Locals from '../providers/Locals';

class RateLimit {
    public static mount(_express: Application): Application {
		const rateLimiter = rateLimit({
            legacyHeaders: true,
            limit: Locals.config().rateLimitMaxRequests,
            message: "Too many requests, please try again later.",
            standardHeaders: true,
            windowMs: Locals.config().windowMs,
            keyGenerator: (req: Request) => req.ip as string,
        });
		_express.use(rateLimiter);
		return _express;
	}
}

export default RateLimit;