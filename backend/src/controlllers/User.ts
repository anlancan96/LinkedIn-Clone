import { StatusCodes } from "http-status-codes";
import { Request, RequestHandler, Response, CookieOptions, NextFunction } from "express";
import { ServiceResponse } from '@/models/serviceResponse'
import Locals from "@/providers/Locals";
import { logger } from '@/index';
import { APIError, catchAsync } from '@/middlewares/error-handler';
import { AuthService } from '@/services/Auth';