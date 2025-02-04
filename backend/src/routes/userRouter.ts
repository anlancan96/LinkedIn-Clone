import express, { type Router } from 'express';
import { authController } from '../controlllers/Auth';

//middleware
import AuthValidator from '../middlewares/Auth/Auth.middleware';
export const userRouter: Router = express.Router(); 

userRouter.route('/login').post(AuthValidator.login, authController.login);
userRouter.route('/signup').post(AuthValidator.signup, authController.signUp);
userRouter.use(AuthValidator.verifyRefreshToken);
userRouter.route('/refresh-token').post(authController.refreshToken);
