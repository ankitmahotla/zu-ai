import { Request, Response } from "express";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import { generateAccessAndRefreshTokens } from "../utils/token";
import {
  LoginUserInput,
  RefreshTokenInput,
  RegisterUserInput,
} from "@ankitmahotla/zu-ai_common";

export async function registerUser(req: Request, res: Response) {
  try {
    const result = RegisterUserInput.safeParse(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json({ message: "Invalid input", errors: result.error.errors });
    }

    const { username, email, password } = result.data;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    await User.create({ username, email, password });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const result = LoginUserInput.safeParse(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json({ message: "Invalid input", errors: result.error.errors });
    }

    const { email, password } = result.data;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email doesn't exist" });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id,
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );

    res.status(200).json({
      message: "Login successful",
      user: loggedInUser,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
}

export async function refreshAccessToken(req: Request, res: Response) {
  try {
    const result = RefreshTokenInput.safeParse(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json({ message: "Invalid input", errors: result.error.errors });
    }

    const { refreshToken: incomingRefreshToken } = result.data;

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as { _id: string };

    const user = await User.findById(decodedToken._id);
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    if (incomingRefreshToken !== user.refreshToken) {
      return res
        .status(401)
        .json({ message: "Refresh token is expired or used" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id,
    );
    res
      .status(200)
      .json({ message: "Tokens refreshed", accessToken, refreshToken });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    res.status(500).json({ message: "Internal server error", error });
  }
}

export async function checkUsername(req: Request, res: Response) {
  try {
    const { username } = req.query;

    if (!username || typeof username !== "string") {
      return res.status(400).json({ message: "Invalid username provided" });
    }

    const user = await User.findOne({ username });

    if (user) {
      return res.status(409).json({ message: "Username is already taken" });
    }

    return res.status(200).json({ message: "Username is available" });
  } catch (error) {
    console.error("Error checking username:", error);
    return res
      .status(500)
      .json({ message: "Internal server error while checking username" });
  }
}
