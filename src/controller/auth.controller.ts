import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import { commonResponse } from "../utils/response";

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
