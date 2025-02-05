import { Request, Response, NextFunction } from 'express';
import { ValidationError as ExpressValidatorError, Result, ValidationError } from 'express-validator';
import { Error as MongooseError } from 'mongoose';
import { logger } from '@/index';
import Locals from '@/providers/Locals';

// Custom error types
interface IAPIError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  code?: number;
  errors?: any;
  errmsg?: string;
  keyValue?: { [key: string]: any };
}

// Error response interface
interface IErrorResponse {
  status: string;
  message: string;
  errorDetails?: any;
  stack?: string;
}

export class APIError extends Error implements IAPIError {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ErrorHandler {
  private static handleMongooseValidationError(err: MongooseError.ValidationError): APIError {
    const errorMessages = Object.values(err.errors).map((error: any) => {
      switch (error.kind) {
        case 'required':
          return `The field '${error.path}' is required`;
        case 'enum':
          return `'${error.value}' is not a valid option for field '${error.path}'`;
        case 'minlength':
          return `'${error.path}' must be at least ${error.properties?.minlength} characters`;
        case 'maxlength':
          return `'${error.path}' cannot exceed ${error.properties?.maxlength} characters`;
        case 'min':
          return `'${error.path}' must be at least ${error.properties?.min}`;
        case 'max':
          return `'${error.path}' cannot exceed ${error.properties?.max}`;
        default:
          return `Invalid ${error.path}: ${error.message}`;
      }
    });

    return new APIError(400, `Validation failed: ${errorMessages.join('. ')}`);
  }

  private static handleDuplicateKeyError(err: IAPIError): APIError {
    const field = Object.keys(err.keyValue || {})[0];
    const value = Object.values(err.keyValue || {})[0];

    let message: string;
    switch (field) {
      case 'email':
        message = `Email address '${value}' is already registered`;
        break;
      case 'username':
        message = `Username '${value}' is already taken`;
        break;
      case 'sku':
        message = `Product SKU '${value}' already exists`;
        break;
      default:
        message = `Duplicate value '${value}' for field '${field}'`;
    }

    return new APIError(400, message);
  }

  private static handleExpressValidatorErrors(errors: Result<ValidationError>): APIError {
    const errorMessages = errors.array().map(error => {
      if (error.type === 'field') {
        return `${error.msg} for field '${error.path}'`;
      }
      return error.msg;
    });

    return new APIError(400, `Validation failed: ${errorMessages.join('. ')}`);
  }

  private static handleCastError(err: MongooseError.CastError): APIError {
    return new APIError(400, `Invalid ${err.path}: ${err.value}`);
  }

  private static handleJWTError(): APIError {
    return new APIError(401, 'Invalid token. Please log in again.');
  }

  private static handleJWTExpiredError(): APIError {
    return new APIError(401, 'Your token has expired. Please log in again.');
  }

  private static formatError(err: IAPIError): IErrorResponse {
    return {
      status: err.status,
      message: err.message,
      ...(!Locals.config().isProduction && {
        errorDetails: err,
        stack: err.stack
      })
    };
  }

  public static handleError(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): Response {
    let error = err;

    // Set default status code and status if not present
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    // Handle specific error types
    if (err instanceof MongooseError.ValidationError) {
      error = this.handleMongooseValidationError(err);
    }
    else if (err.code === 11000) {
      error = this.handleDuplicateKeyError(err);
    }
    else if (err instanceof MongooseError.CastError) {
      error = this.handleCastError(err);
    }
    else if (err.name === 'JsonWebTokenError') {
      error = this.handleJWTError();
    }
    else if (err.name === 'TokenExpiredError') {
      error = this.handleJWTExpiredError();
    }
    // Check if the error is from express-validator
    else if (err instanceof Result) {
      error = this.handleExpressValidatorErrors(err);
    }

    // Log error
    if (!Locals.config().isProduction) {
      logger.error('ERROR 💥', {
        error: err,
        stack: err.stack
      });
    } else {
      logger.error('ERROR 💥', {
        message: err.message,
        statusCode: err.statusCode,
        status: err.status
      });
    }

    return res.status(error.statusCode).json(this.formatError(error));
  }
}

// Async handler wrapper
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  ErrorHandler.handleError(err, req, res, next);
};