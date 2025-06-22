import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { commonResponse } from "../utils/response";

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          message: err.message,
        }));
        commonResponse(res, 400, "FAILED", "Validation error", formattedErrors);
      } else {
        commonResponse(res, 400, "ERROR", "Something went wrong");
      }
    }
  };
};
