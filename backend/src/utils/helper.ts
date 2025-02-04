const fs = require("fs");
const path = require('path');
import type { Request, NextFunction, Response } from "express";
import { ExpressValidator, CustomValidationChain, CustomSchema } from 'express-validator';
import { ServiceResponse } from "../models/serviceResponse";

export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response) => {
    return response.status(serviceResponse.statusCode).send(serviceResponse);
};  

export const readPrivateKey = (): string | null => {
    let filePath = path.join(__dirname, "../configs/private.pem")
    try{
        let data: string = fs.readFileSync(filePath,'utf-8');
        if(!data){
            console.log('Cannot read the private key');
            return null;
        }
        return data;
    }catch(error){
        console.log(error)
        return null;
    }
}
//Returns the public key
export const readPublicKey = () : string | null => {
    let filePath = path.join(__dirname, "../configs/public.pem")
    try {
        let data: string = fs.readFileSync(filePath, 'utf-8');
        if(!data){
            console.log('Cannot read the public key!');
            return null;
        }
        return data
    } catch(error) {
        console.log(error)
        return null;
    }
}

const myExpressValidator = new ExpressValidator();
export type MyValidationChain = CustomValidationChain<typeof myExpressValidator>;
export type MySchema = CustomSchema<typeof myExpressValidator>;

export const validate = (validations: MyValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      // sequential processing, stops running validations chain if one fails.
      for (const validation of validations) {
        const result = await validation.run(req);
        if (!result.isEmpty()) {
          return res.status(400).json({ errors: result.array() });
        }
      }
      next();
    };
};