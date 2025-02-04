import { Application } from 'express';
import * as path from 'path';
import * as dotenv from 'dotenv';

export type ConfigType = {
	isProduction: boolean;
	url: string;
	port: number;
	appSecret: string;
	mongooseUrl: string;
	maxUploadLimit: string;
	maxParameterLimit?: number;
	name: string;
	company: string;
	isCORSEnabled: boolean;
	jwtExpiresIn: string | number;
	apiPrefix: string;
	logDays: number;
	rateLimitMaxRequests: number;
	windowMs: number;
}

class Locals {
	public static config(): ConfigType {
		dotenv.config({ path: path.join(__dirname, '../../.env') });
		const isProduction = process.env.ENV == 'prod';
		const url = process.env.APP_URL || `http://localhost:${process.env.PORT}`;
		const port = process.env.PORT ? Number(process.env.PORT) : 4040;
		const appSecret = process.env.APP_SECRET || 'This is your responsibility!';
		const mongooseUrl = process.env.MONGOOSE_URL || 'mongodb://127.0.0.1:27017/LinkedInClone';
		const maxUploadLimit = process.env.APP_MAX_UPLOAD_LIMIT || '50mb';
		const maxParameterLimit = process.env.APP_MAX_PARAMETER_LIMIT ? Number(process.env.APP_MAX_PARAMETER_LIMIT) : 50;

		const name = process.env.APP_NAME || 'LinkedIn Clone';
		const company = process.env.COMPANY_NAME || 'AnLe';

		const isCORSEnabled = process.env.CORS_ENABLED ? Boolean(process.env.CORS_ENABLED) : true;
		const jwtExpiresIn = process.env.JWT_EXPIRES_IN || 3;
		const apiPrefix = process.env.API_PREFIX || 'api';
		const logDays = process.env.LOG_DAYS ? Number(process.env.LOG_DAYS) : 10;
		const rateLimitMaxRequests = process.env.COMMON_RATE_LIMIT_MAX_REQUESTS ? Number(process.env.COMMON_RATE_LIMIT_MAX_REQUESTS) : 20 
		const windowMs = process.env.COMMON_RATE_LIMIT_WINDOW_MS ? Number(process.env.COMMON_RATE_LIMIT_WINDOW_MS) : 1000 // 1s
		return {
			isProduction,
            url,
			appSecret,
			apiPrefix,
			company,
			isCORSEnabled,
			jwtExpiresIn,
			logDays,
			maxUploadLimit,
			maxParameterLimit,
			mongooseUrl,
			name,
			port,
			rateLimitMaxRequests,
			windowMs,
		};
	}

	/**
	 * Injects your config to the app's locals
	 */
	public static init (_express: Application): Application {
		_express.locals.app = this.config();
		return _express;
	}
}

export default Locals;