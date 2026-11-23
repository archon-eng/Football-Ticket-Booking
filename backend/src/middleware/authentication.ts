import type { RequestHandler } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken"
import { User, type UserRole } from "../models/User.js"
import {
  AUTH_COOKIE_NAME,
  getJwtSecret,
  isPrivilegedAdminEmail,
} from "../utils/auth.js"

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
    res.status(401).json({ message: "Please sign in to continue your experience." })
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
      res.status(401).json({
        message: "Your session is no longer valid. Please sign in again.",
      })
      return
    }
    payload = verified
  } catch {
    res.status(401).json({
      message: "Your session is no longer valid. Please sign in again.",
    })
    return
  }

  try {
    const user = await User.findById(payload.userId).select(
      "username email role +adminApproved",
    )
    if (!user) {
      res.status(401).json({ message: "Please sign in to continue your experience." })
      return
    }
    if (
      user.role === "admin" &&
      user.adminApproved !== true &&
      !isPrivilegedAdminEmail(user.email)
    ) {
      res.status(403).json({
        message:
          "Your administrator access request is currently under review. We will welcome you in once it has been approved.",
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
        ? "Administrator privileges are required to access this area."
        : "Please sign in to continue your experience.",
    })
    return
  }

  next()
}
