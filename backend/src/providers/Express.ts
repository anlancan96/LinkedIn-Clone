import express from 'express';
import Locals from './Locals';
import CORS from '../middlewares/CORS';
import Http from '../middlewares/Http';
import RateLimit from '../middlewares/RateLimit';
import requestLogger from '../middlewares/requestLogger';
//routes
import { userRouter } from '../routes/userRouter';
import { errorHandler } from '../middlewares/error-handler';
class Express {
    public app: express.Application;
    constructor(){
        this.app = express();
		this.mountDotEnv();
		this.mountMiddlewares();
		this.mountRoutes();
		this.app.use(errorHandler);
    }

    private mountDotEnv (): void {
		this.app = Locals.init(this.app);
	}

	/**
	 * Mounts all the defined middlewares
	 */
	private mountMiddlewares (): void {
		if (Locals.config().isCORSEnabled) {
			// Mount CORS middleware
			this.app = CORS.mount(this.app);
		}

		// Mount basic express apis middleware
		this.app = Http.mount(this.app);
        this.app = RateLimit.mount(this.app);
		this.app.use(requestLogger);
	}

	/**
	 * Mounts all the defined routes
	 */
	private mountRoutes (): void {
		this.app.use('/', userRouter);
	}

	/**
	 * Starts the express server
	 */
	public init (): any {
		const port: number = Locals.config().port;
		// Start the server on the specified port
		this.app.listen(port, () => {
			return console.log('\x1b[33m%s\x1b[0m', `Server :: Running @ 'http://localhost:${port}'`);
		}).on('error', (_error) => {
			return console.log('Error: ', _error.message);
		});
	}
}

export default Express;