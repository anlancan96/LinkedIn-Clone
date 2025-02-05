import mongoose from 'mongoose';
import { MongoError } from 'mongodb';

import Locals from './Locals';
import { logger } from '@/index';

export class Database {
	// Initialize your database pool
	public static init (): any {
		const dsn = Locals.config().mongooseUrl;
		mongoose.connect(dsn)
			.then(() => {
                logger.info('connected to mongo server at: ' + dsn);
		}).catch((error: MongoError) => {
            logger.info('Failed to connect to the Mongo server!!');
            logger.error(error);
		});
	}
}

export default mongoose;