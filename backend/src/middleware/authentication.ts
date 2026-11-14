import type { RequestHandler } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken"
import { User, type UserRole } from "../models/User.js"
import { AUTH_COOKIE_NAME, getJwtSecret } from "../utils/auth.js"

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string
        username: string
        email: string
        role: UserRole
      }
    }
  }
}

export const authenticate: RequestHandler = async (req, res, next) => {
  const token: unknown = req.cookies?.[AUTH_COOKIE_NAME]
  if (typeof token !== "string" || token.length === 0) {
    res.status(401).json({ message: "Please sign in to continue." })
    return
  }

  let jwtSecret: string
  try {
    jwtSecret = getJwtSecret()
  } catch (error) {
    next(error)
    return
  }

  let payload: JwtPayload
  try {
    const verified = jwt.verify(token, jwtSecret, { algorithms: ["HS256"] })
    if (
      typeof verified === "string" ||
      typeof verified.userId !== "string" ||
      !/^[a-f\d]{24}$/i.test(verified.userId)
    ) {
      res.status(401).json({ message: "Your session is no longer valid." })
      return
    }
    payload = verified
  } catch {
    res.status(401).json({ message: "Your session is no longer valid." })
    return
  }

  try {
    const user = await User.findById(payload.userId).select(
      "username email role +adminApproved",
    )
    if (!user) {
      res.status(401).json({ message: "Please sign in to continue." })
      return
    }
    if (user.role === "admin" && user.adminApproved !== true) {
      res.status(403).json({
        message: "Administrator access is awaiting approval.",
      })
      return
    }

    req.auth = {
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    }
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
