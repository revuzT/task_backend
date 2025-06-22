import { Request, Response, NextFunction } from "express";
import { commonResponse } from "../utils/response";
import { decrypt } from "../utils/encryption";
import { verifyJWT } from "../utils/jwt";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const encryptedToken = req?.cookies?.token || req.header("x-access-token");
    const encryptedHeaderEmail = req.header("x-user");
    if (!encryptedToken || !encryptedHeaderEmail) {
      res.clearCookie("token");
      commonResponse(res, 401, "FAILED", "Unauthorized request");
      return;
    }

    const token = decrypt(encryptedToken);
    const emailFromHeader = decrypt(encryptedHeaderEmail);

    const payload = verifyJWT(token);
    if (!payload) {
      res.clearCookie("token");
      commonResponse(res, 401, "FAILED", "Invalid or expired token");
      return;
    }

    if (payload.email !== emailFromHeader) {
      res.clearCookie("token");
      commonResponse(res, 403, "FAILED", "Email mismatch in token");
      return;
    }

    (req as any).user = payload;

    next();
  } catch (error) {
    res.clearCookie("token");
    commonResponse(res, 401, "ERROR", "Authentication failed", error);
    return;
  }
};
