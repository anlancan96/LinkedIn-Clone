const cors = require('cors');
import { Application } from 'express';
import Locals from '@/providers/Locals';

class CORS {
	public static mount(_express: Application): Application {
		const options = {
			origin: Locals.config().url,
			optionsSuccessStatus: 200,
            credentials: true		
		};
		_express.use(cors(options));
		return _express;
	}
}

export default CORS;