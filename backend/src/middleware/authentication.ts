import type { RequestHandler } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken"
import { User } from "../models/User.js"

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string
        role: "user" | "admin"
      }
    }
  }
}

export const authenticate: RequestHandler = async (req, res, next) => {
  const token = req.cookies?.token
  if (!token) {
    res.status(401).json({ message: "Please sign in to continue." })
    return
  }

  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    res
      .status(500)
      .json({ message: "Authentication is temporarily unavailable." })
    return
  }

  let payload: JwtPayload
  try {
    const verified = jwt.verify(token, jwtSecret)
    if (typeof verified === "string" || typeof verified.userId !== "string") {
      res.status(401).json({ message: "Your session is no longer valid." })
      return
    }
    payload = verified
  } catch {
    res.status(401).json({ message: "Your session is no longer valid." })
    return
  }

  try {
    const user = await User.findById(payload.userId).select("role")
    if (!user) {
      res.status(401).json({ message: "Please sign in to continue." })
      return
    }

    req.auth = { userId: user._id.toString(), role: user.role }
    next()
  } catch (error) {
    next(error)
  }
}

export const requireAdmin: RequestHandler = (req, res, next) => {
  if (req.auth?.role !== "admin") {
    res.status(req.auth ? 403 : 401).json({
      message: req.auth
        ? "Administrator access is required."
        : "Please sign in to continue.",
    })
    return
  }

  next()
}
