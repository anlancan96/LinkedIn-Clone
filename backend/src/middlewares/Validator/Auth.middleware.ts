import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { APIError, catchAsync } from "../error-handler";
import User from "@/models/user.model";
import { StatusCodes } from "http-status-codes";
import jwt from 'jsonwebtoken';
import { TokenPayload } from "../../../types/TokenPayLoad";
import { readPublicKey } from "@/utils/helper";
import { logger } from "@/index";

export default class AuthValidator {
  public static login = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      try {
        await body("email")
          .notEmpty()
          .withMessage("Email is required")
          .custom(async (value) => {
            const user = await User.findByEmail(value);
            if (!user) {
              throw new APIError(401, "User's not found");
            }
            req.userId = user._id.toString();
            return true;
          })
          .run(req);
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
          return next(errors);
        }
        await body("password")
          .notEmpty()
          .withMessage("Password is required")
          .isLength({ min: 8 })
          .withMessage("Password must be at least 8 characters")
          .run(req);
        errors = validationResult(req);
        if (!errors.isEmpty()) {
          return next(errors);
        }
        next();
      } catch (error) {
        next(error);
      }
    }
  );

  public static signup = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      try {
        await body("email")
          .notEmpty()
          .withMessage("Email is required")
          .run(req);
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
          return next(errors);
        }
        await body("password")
          .notEmpty()
          .withMessage("Password is required")
          .isLength({ min: 8 })
          .withMessage("Password must be at least 8 characters")
          .run(req);
        errors = validationResult(req);
        if (!errors.isEmpty()) {
          return next(errors);
        }
        next();
      } catch (error) {
        next(error);
      }
    }
  );

  public static verifyRefreshToken = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Get refresh token from request (either from cookie or authorization header)
      const refreshToken =
        req.cookies?.jwt || req.headers.authorization?.split(" ")[1];

      if (!refreshToken) {
        throw new APIError(StatusCodes.BAD_REQUEST, "No refresh token provided");
      }
      let publicKey: string | null = readPublicKey();
      if (!publicKey) {
        throw new APIError(StatusCodes.SERVICE_UNAVAILABLE, "No refresh token provided");
      }
      // Verify the refresh token
      const decoded = jwt.verify(
        refreshToken,
        publicKey
      ) as TokenPayload;
      // Check if token is expired
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTimestamp) {
        throw new APIError(StatusCodes.UNAUTHORIZED, "Refresh token has expired");
      }

      // Attach decoded token to request for use in next middleware
      req.userId = decoded.userId;
      next();
    } catch (error) {
      next(error);
    }
  };

  public static authorizeRoles = (...roles: string[]) => {
    return catchAsync(
      async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
          if (!req.userId) {
            throw new APIError(
              StatusCodes.UNAUTHORIZED,
              "You must be logged in to access this route"
            );
          }
  
          // Get user from database to check their role
          const role = await User.findRoleByUserId(req.userId);
          if (!role) {
            throw new APIError(StatusCodes.NOT_FOUND, "User not found");
          }
  
          // Check if user's role is included in the allowed roles
          if (!roles.includes(role)) {
            throw new APIError(
              StatusCodes.FORBIDDEN,
              "You do not have permission to access this route"
            );
          }
  
          next();
        } catch (error) {
          next(error);
        }
      }
    )
  }
}
