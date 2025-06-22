import { Response } from "express";

export const commonResponse = (
  res: Response,
  statusCode: number,
  status: "SUCCESS" | "FAILED" | "ERROR",
  message: string,
  data: any = null
): Response => {
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};
