import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { env } from "../config/env.js";
import User from "../models/User.js";

export function signToken(userId) {
  return jwt.sign({ sub: String(userId) }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

/** Requires a valid JWT (from the Authorization header or the `token` cookie). */
export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  const bearer = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const token = bearer || req.cookies?.token;

  if (!token) {
    res.status(401);
    throw new Error("Not authenticated — missing token.");
  }

  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.sub);
    if (!user) {
      res.status(401);
      throw new Error("Not authenticated — user no longer exists.");
    }
    req.user = user;
    next();
  } catch {
    res.status(401);
    throw new Error("Not authenticated — invalid or expired token.");
  }
});
