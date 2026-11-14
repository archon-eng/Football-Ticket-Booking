import { createHash, randomBytes } from "node:crypto"
import type { Response } from "express"
import jwt from "jsonwebtoken"
import type { UserRole } from "../models/User.js"

export const AUTH_COOKIE_NAME = "token"
export const AUTH_TOKEN_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000
export const AUTH_TOKEN_TTL_SECONDS = AUTH_TOKEN_MAX_AGE_MS / 1000
export const ADMIN_APPROVAL_TTL_MS = 24 * 60 * 60 * 1000

const authCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
})

export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables")
  }
  return secret
}

export const createAuthToken = (userId: string, role: UserRole) =>
  jwt.sign({ userId, role }, getJwtSecret(), {
    expiresIn: AUTH_TOKEN_TTL_SECONDS,
    algorithm: "HS256",
  })

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie(AUTH_COOKIE_NAME, token, {
    ...authCookieOptions(),
    maxAge: AUTH_TOKEN_MAX_AGE_MS,
  })
}

export const clearAuthCookie = (res: Response) => {
  res.clearCookie(AUTH_COOKIE_NAME, authCookieOptions())
}

export const createAdminApprovalToken = () => {
  const token = randomBytes(32).toString("hex")
  const tokenHash = createHash("sha256").update(token).digest("hex")
  return { token, tokenHash }
}

export const hashAdminApprovalToken = (token: string) =>
  createHash("sha256").update(token).digest("hex")
