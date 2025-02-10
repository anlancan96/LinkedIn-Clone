import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { APIError, catchAsync } from "../error-handler";
import User from "@/models/user.model";
import { StatusCodes } from "http-status-codes";
import { readPublicKey } from "@/utils/helper";
import { logger } from "@/index";