import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import { commonResponse } from "../utils/response";
import { generateJWT } from "../utils/jwt";
import { encrypt } from "../utils/encryption";

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
