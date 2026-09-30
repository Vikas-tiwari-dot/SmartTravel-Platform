import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { signToken } from "../middleware/auth.js";

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409);
    throw new Error("An account with that email already exists.");
  }

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({
    name,
    email,
    passwordHash,
    handle: `@${name.split(" ")[0].toLowerCase()}`,
  });

  const token = signToken(user._id);
  res.cookie("token", token, COOKIE_OPTS);
  res.status(201).json({ user: user.toPublicJSON(), token });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Incorrect email or password.");
  }

  const token = signToken(user._id);
  res.cookie("token", token, COOKIE_OPTS);
  res.json({ user: user.toPublicJSON(), token });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  res.status(204).send();
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toPublicJSON() });
});
