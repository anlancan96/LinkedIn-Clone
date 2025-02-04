import jwt, { type SignOptions } from 'jsonwebtoken';
import { StatusCodes } from "http-status-codes";
import { Request, RequestHandler, Response, CookieOptions, NextFunction } from "express";
import { readPrivateKey, handleServiceResponse, readPublicKey } from '../../utils/helper';
import { ServiceResponse } from '../../models/serviceResponse'
import Locals from "../../providers/Locals";
import { logger } from '../..';
import { APIError, catchAsync } from '../../middlewares/error-handler';
import { AuthService } from '../../services/Auth';

class AuthController {
    private generateAccessToken(req: Request, res: Response): any {
        let privateKey: string | null = readPrivateKey();
        if(!privateKey) {
            logger.error("Cannot read private key !");
            const serviceResponse = ServiceResponse.failure("Cannot read private key !", null);
            return handleServiceResponse(serviceResponse, res);
        }
        //creating a access token
        let jwtAccessOptions: SignOptions = {
            algorithm: "RS256",
            issuer: Locals.config().company,
            audience: Locals.config().url,
            expiresIn: (30 * 60), // 30mins
            subject: '',
            jwtid: `${(Math.floor(Date.now()))}`
        }
        const accessToken = jwt.sign({
            userid: req.userId,
        }, privateKey, jwtAccessOptions);
        // Creating refresh token not that expiry of refresh 
        //token is greater than the access token

        let jwtRefreshOptions: SignOptions = {
            algorithm: "RS256",
            issuer: Locals.config().company,
            audience: Locals.config().url,
            expiresIn: '24W', // 6 months
            subject: '',
            jwtid: `${(Math.floor(Date.now()))}`
        }
        const refreshToken = jwt.sign({
            userid: req.userId,
        }, privateKey, jwtRefreshOptions);

        // Assigning refresh token in http-only cookie 
        const options: CookieOptions = {
            httpOnly: true,
            sameSite: 'none', 
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        }
        res.cookie('jwt', refreshToken, options);
        const serviceResponse = ServiceResponse.success("Login successfully", { accessToken })
        return handleServiceResponse(serviceResponse, res);
    } 
    public login: RequestHandler = catchAsync(async(req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const user = await AuthService.login(req.body.email, req.body.password);
            if(!user) {
                throw new APIError(StatusCodes.UNAUTHORIZED, 'Incorrect email or password');
            }
            return this.generateAccessToken(req, res);
        } catch (error) {
            next(error);
        }
    })

    public signUp: RequestHandler = catchAsync(async(req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const user = await AuthService.signup({
                email: req.body.email,
                password: req.body.password,
                name: req.body.email,
            });
            if (!user) {
                return next(new APIError(StatusCodes.BAD_REQUEST, 'Could not create user'));
            }
            req.userId = user.id;
            return this.generateAccessToken(req, res);
        } catch (error) {
            next(error);
        }
    })

    public refreshToken: RequestHandler = (req: Request, res: Response, next: NextFunction): any => {
        try {
            let privateKey: string | null = readPrivateKey();
            if (!privateKey) {
                logger.error("Cannot read private key !");
                const serviceResponse = ServiceResponse.failure("Cannot read private key !", null);
                return handleServiceResponse(serviceResponse, res);
            }
            //creating a access token
            let jwtAccessOptions: SignOptions = {
                algorithm: "RS256",
                issuer: Locals.config().company,
                audience: Locals.config().url,
                expiresIn: 30 * 60, // 30mins
                subject: "",
                jwtid: `${Math.floor(Date.now())}`,
            };
            const accessToken = jwt.sign({ userid: req.userId,},
                privateKey,
                jwtAccessOptions
            );
            const serviceResponse = ServiceResponse.success("Refresh token successfully", { accessToken });
            return handleServiceResponse(serviceResponse, res);
        } catch (error) {
            next(error);
        }
    }
}

export const authController = new AuthController();