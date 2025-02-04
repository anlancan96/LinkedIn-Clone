import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import helmet from "helmet";
const compress = require('compression');
import Locals from '../providers/Locals';

class Http {
	public static mount(_express: Application): Application {
		// Enables the request body parser
		_express.use(express.json({
			limit: Locals.config().maxUploadLimit
		}));

		_express.use(express.urlencoded({
			limit: Locals.config().maxUploadLimit,
			parameterLimit: Locals.config().maxParameterLimit,
			extended: false
		}));
		_express.use(cookieParser());
		// Enables the "gzip" / "deflate" compression for response
		_express.use(compress());
		_express.use(helmet());
		return _express;
	}
}

export default Http;
