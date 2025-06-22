import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import { commonResponse } from "../utils/response";
import { generateJWT, verifyJWT } from "../utils/jwt";
import { decrypt, encrypt } from "../utils/encryption";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      commonResponse(res, 400, "FAILED", "User already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    commonResponse(
      res,
      201,
      "SUCCESS",
      "Registered successfully. Please log in."
    );
  } catch (error: any) {
    commonResponse(res, 500, "ERROR", "Registration failed", error.message);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      commonResponse(res, 400, "FAILED", "Invalid email or password");
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      commonResponse(res, 400, "FAILED", "Invalid email or password");
      return;
    }

    const payload = { userId: user._id, email: user.email };

    const jwtToken = generateJWT(payload);
    const encryptedToken = encrypt(jwtToken);
    const encryptedEmail = encrypt(user.email);

    res.cookie("token", encryptedToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    commonResponse(res, 200, "SUCCESS", "Login successful", {
      email: encryptedEmail,
    });
  } catch (error: any) {
    commonResponse(res, 500, "ERROR", "Login failed", error.message);
  }
};

export const validateM = (req: Request, res: Response) => {
  try {
    const encryptedToken = req.cookies?.token || req.header("x-access-token");
    const encryptedEmail = req.header("x-user");

    if (!encryptedToken || !encryptedEmail) {
      commonResponse(res, 401, "FAILED", "Unauthorized");
      return;
    }

    const token = decrypt(encryptedToken);
    const emailFromHeader = decrypt(encryptedEmail);

    const payload = verifyJWT(token);
    if (!payload || payload.email !== emailFromHeader) {
      commonResponse(res, 401, "FAILED", "Invalid session");
      return;
    }

    commonResponse(res, 200, "SUCCESS", "Session valid", {
      userId: payload.userId,
      email: payload.email,
    });
    return;
  } catch (error: any) {
    commonResponse(
      res,
      401,
      "ERROR",
      "Session validation failed",
      error.message
    );
  }
  return;
};

export const logout = (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    commonResponse(res, 200, "SUCCESS", "Logged out successfully");
    return;
  } catch (error: any) {
    commonResponse(res, 500, "ERROR", "Logout failed", error.message);
    return;
  }
};
