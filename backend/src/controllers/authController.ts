import bcrypt from "bcryptjs"
import type { Request, Response } from "express"
import { z } from "zod"
import { User, type IUser } from "../models/User.js"
import {
  ADMIN_APPROVAL_TTL_MS,
  clearAuthCookie,
  createAdminApprovalToken,
  createAuthToken,
  hashAdminApprovalToken,
  isPrivilegedAdminEmail,
  setAuthCookie,
} from "../utils/auth.js"
import { sendAdminApprovalEmail } from "../utils/sendMail.js"

const emailSchema = z
  .string()
  .trim()
  .pipe(z.email({ message: "Please provide a valid email address." }))
  .transform((email) => email.toLowerCase())

const signUpSchema = z.object({
  username: z.string().trim().max(64),
  email: emailSchema,
  password: z.string().min(8, {
    message: "Your password must contain at least eight characters.",
  }),
  role: z.enum(["user", "admin"]),
})

const logInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Please enter your password." }),
  role: z.enum(["user", "admin"]),
})

const profileUpdateSchema = z.strictObject({
  username: z
    .string()
    .trim()
    .min(1, { message: "Please provide your name." })
    .max(64),
  email: emailSchema,
})

const getAuthValidationErrors = (error: z.ZodError) =>
  z.flattenError(error).fieldErrors

// Privileged administrator identities are managed in utils/auth.ts.

const isDuplicateKeyError = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  error.code === 11000

const publicUser = (
  user: Pick<IUser, "_id" | "username" | "email" | "role">,
) => ({
  username: user.username,
  email: user.email,
  _id: user._id.toString(),
  role: user.role,
})

const isApprovalToken = (value: unknown): value is string =>
  typeof value === "string" && /^[a-f\d]{64}$/i.test(value)

const approvalPage = (
  title: string,
  message: string,
  token?: string,
  action?: "approve" | "reject",
) => {
  const actionLabel = action === "approve" ? "Approve Access" : "Decline Request"
  const form =
    token && action
      ? `<form method="post" action="/api/auth/verify-admin/${token}" style="margin-top:28px;"><input type="hidden" name="action" value="${action}"><button type="submit" style="display:inline-block;padding:14px 22px;border:0;border-radius:999px;background:#d6c19b;color:#11100e;font:600 14px/1.2 Inter, sans-serif;letter-spacing:0.01em;cursor:pointer;">${actionLabel}</button></form>`
      : ""

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} | The Matchday</title></head><body style="margin:0;padding:40px 20px;background:#11100e;color:#f2ebdd;font-family:Inter, sans-serif;"><main style="max-width:640px;margin:0 auto;padding:36px 32px;background:#1b1915;border:1px solid #39352e;border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,0.35);"><p style="margin:0 0 14px;color:#d6c19b;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">The Matchday · Executive Access</p><h1 style="margin:0;color:#f2ebdd;font-family:Manrope, serif;font-size:30px;line-height:1.2;">${title}</h1><p style="margin:18px 0 0;color:#c9c0b1;font-size:15px;line-height:1.7;">${message}</p>${form}</main></body></html>`
}

export const signUp = async (req: Request, res: Response) => {
  try {
    const result = signUpSchema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({ errors: getAuthValidationErrors(result.error) })
    }

    const { username, email, password, role } = result.data
    if (isPrivilegedAdminEmail(email) && role !== "admin") {
      return res.status(403).json({
        message:
          "This email address is reserved exclusively for administrator access. Please use the administrator sign-in option.",
      })
    }

    const name = (username || email.split("@")[0]).slice(0, 64)

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({
        message:
          "An account with this email address already exists. Please sign in to continue.",
      })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    if (role === "admin") {
      if (isPrivilegedAdminEmail(email)) {
        const user = await User.create({
          username: name,
          email,
          passwordHash,
          role,
          adminApproved: true,
        })
        setAuthCookie(res, createAuthToken(user._id.toString(), user.role))
        return res.status(201).json({ user: publicUser(user) })
      }

      const { token, tokenHash } = createAdminApprovalToken()
      const user = await User.create({
        username: name,
        email,
        passwordHash,
        role,
        adminApproved: false,
        adminApprovalTokenHash: tokenHash,
        adminApprovalExpiresAt: new Date(Date.now() + ADMIN_APPROVAL_TTL_MS),
      })

      try {
        await sendAdminApprovalEmail(email, token)
      } catch (error) {
        console.error("Admin approval email could not be sent:", error)
        return res.status(202).json({
          message:
            "Your administrator access request has been received and is awaiting review. At this time, the authorization email could not be delivered. Please try signing in later, and we will gladly assist in resending it.",
        })
      }

      return res.status(202).json({
        message:
          "Your administrator access request has been received and is now awaiting review.",
      })
    }

    const user = await User.create({
      username: name,
      email,
      passwordHash,
      role,
    })
    setAuthCookie(res, createAuthToken(user._id.toString(), user.role))
    return res.status(201).json({ user: publicUser(user) })
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return res.status(409).json({
        message:
          "An account with this email address already exists. Please sign in to continue.",
      })
    }
    console.error("SignUp Error:", error)
    return res.status(500).json({
      message:
        "We were unable to complete your account request at this time. Please try again shortly.",
    })
  }
}

export const logIn = async (req: Request, res: Response) => {
  try {
    const result = logInSchema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({ errors: getAuthValidationErrors(result.error) })
    }

    const { email, password, role } = result.data
    if (isPrivilegedAdminEmail(email) && role !== "admin") {
      return res.status(403).json({
        message:
          "This email address is reserved exclusively for administrator access. Please use the administrator sign-in option.",
      })
    }

    const user = await User.findOne({ email }).select(
      "+adminApproved +adminApprovalTokenHash +adminApprovalExpiresAt",
    )
    if (!user) {
      return res.status(401).json({
        message:
          "We could not verify the credentials provided. Please review your details and try again.",
      })
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch || user.role !== role) {
      return res.status(401).json({
        message:
          "We could not verify the credentials provided. Please review your details and try again.",
      })
    }

    if (
      user.role === "admin" &&
      user.adminApproved !== true &&
      !isPrivilegedAdminEmail(email)
    ) {
      const approvalIsPending =
        user.adminApprovalTokenHash &&
        user.adminApprovalExpiresAt &&
        user.adminApprovalExpiresAt.getTime() > Date.now()

      if (!approvalIsPending) {
        const { token, tokenHash } = createAdminApprovalToken()
        user.adminApproved = false
        user.adminApprovalTokenHash = tokenHash
        user.adminApprovalExpiresAt = new Date(
          Date.now() + ADMIN_APPROVAL_TTL_MS,
        )
        await user.save()

        try {
          await sendAdminApprovalEmail(email, token)
        } catch (error) {
          console.error("Admin approval email could not be sent:", error)
          user.adminApprovalTokenHash = undefined
          user.adminApprovalExpiresAt = undefined
          await user.save()
          return res.status(202).json({
            message:
              "Your administrator access request remains under review. At this time, the authorization email could not be delivered. Please try signing in again later, and we will be pleased to resend it.",
          })
        }

        return res.status(202).json({
          message:
            "A new administrator access authorization request has been sent for your review.",
        })
      }

      return res.status(202).json({
        message:
          "Your administrator access request is currently under review. We appreciate your patience.",
      })
    }

    setAuthCookie(res, createAuthToken(user._id.toString(), user.role))
    return res.status(200).json({ user: publicUser(user) })
  } catch (error) {
    console.error("LogIn Error:", error)
    return res.status(500).json({
      message:
        "We were unable to complete your sign-in at this time. Please try again shortly.",
    })
  }
}

export const logOut = (_req: Request, res: Response) => {
  clearAuthCookie(res)
  return res
    .status(200)
    .json({ message: "You have been signed out successfully." })
}

export const getMe = (req: Request, res: Response) => {
  if (!req.auth) {
    return res
      .status(401)
      .json({ message: "Please sign in to continue your experience." })
  }

  return res.status(200).json({
    user: {
      _id: req.auth.userId,
      username: req.auth.username,
      email: req.auth.email,
      role: req.auth.role,
    },
  })
}

const pendingAdminApprovalQuery = (token: string) => ({
  role: "admin" as const,
  adminApproved: false,
  adminApprovalTokenHash: hashAdminApprovalToken(token),
  adminApprovalExpiresAt: { $gt: new Date() },
})

export const reviewAdminApproval = async (req: Request, res: Response) => {
  const token = req.params.token
  const action = req.query.action
  if (
    !isApprovalToken(token) ||
    (action !== "approve" && action !== "reject")
  ) {
    return res
      .status(400)
      .type("html")
      .send(
        approvalPage(
          "Invalid Authorization Request",
          "The administrator authorization link you followed is invalid or incomplete. Please request a new review invitation and try again.",
        ),
      )
  }

  try {
    const request = await User.exists(pendingAdminApprovalQuery(token))
    if (!request) {
      return res
        .status(410)
        .type("html")
        .send(
          approvalPage(
            "Authorization Request Unavailable",
            "This administrator authorization request has expired or has already been completed. If access is still required, a new request may be submitted from the sign-in page.",
          ),
        )
    }

    return res
      .status(200)
      .type("html")
      .send(
        approvalPage(
          action === "approve"
            ? "Approve Administrator Access"
            : "Decline Administrator Access",
          action === "approve"
            ? "Please confirm that you wish to grant administrator access for this account."
            : "Please confirm that you wish to decline this administrator access request.",
          token,
          action,
        ),
      )
  } catch (error) {
    console.error("Admin approval review failed:", error)
    return res
      .status(500)
      .type("html")
      .send(
        approvalPage(
          "Authorization Temporarily Unavailable",
          "We were unable to present this authorization request at this time. Please try again shortly.",
        ),
      )
  }
}

export const completeAdminApproval = async (req: Request, res: Response) => {
  const token = req.params.token
  const action =
    typeof req.body === "object" && req.body !== null
      ? req.body.action
      : undefined
  if (
    !isApprovalToken(token) ||
    (action !== "approve" && action !== "reject")
  ) {
    return res
      .status(400)
      .type("html")
      .send(
        approvalPage(
          "Invalid Authorization Request",
          "This administrator authorization request could not be validated. Please return to the review invitation and try again.",
        ),
      )
  }

  try {
    const requestQuery = pendingAdminApprovalQuery(token)
    const user =
      action === "approve"
        ? await User.findOneAndUpdate(
            requestQuery,
            {
              $set: { adminApproved: true },
              $unset: {
                adminApprovalTokenHash: 1,
                adminApprovalExpiresAt: 1,
              },
            },
            { new: true },
          )
        : await User.findOneAndDelete(requestQuery)

    if (!user) {
      return res
        .status(410)
        .type("html")
        .send(
          approvalPage(
            "Authorization Request Unavailable",
            "This administrator authorization request has expired or has already been completed.",
          ),
        )
    }

    return res
      .status(200)
      .type("html")
      .send(
        approvalPage(
          action === "approve"
            ? "Administrator Access Approved"
            : "Administrator Access Declined",
          action === "approve"
            ? "Administrator access has been approved. The account is now active and may sign in."
            : "This administrator access request has been declined.",
        ),
      )
  } catch (error) {
    console.error("Admin approval completion failed:", error)
    return res
      .status(500)
      .type("html")
      .send(
        approvalPage(
          "Authorization Temporarily Unavailable",
          "We were unable to complete this authorization request at this time. Please try again shortly.",
        ),
      )
  }
}

export const updateProfile = async (req: Request, res: Response) => {
  const auth = req.auth
  if (!auth?.userId) {
    return res
      .status(401)
      .json({ message: "Please sign in to continue your experience." })
  }

  const result = profileUpdateSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ errors: getAuthValidationErrors(result.error) })
  }

  const currentEmail = auth.email
  const nextEmail = result.data.email
  if (isPrivilegedAdminEmail(currentEmail) && nextEmail !== currentEmail) {
    return res.status(403).json({
      message:
        "The email address associated with this privileged administrator account cannot be changed.",
    })
  }
  if (
    isPrivilegedAdminEmail(nextEmail) &&
    (!isPrivilegedAdminEmail(currentEmail) || auth.role !== "admin")
  ) {
    return res.status(403).json({
      message:
        "This email address is reserved exclusively for administrator access.",
    })
  }

  try {
    const user = await User.findByIdAndUpdate(auth.userId, result.data, {
      new: true,
      runValidators: true,
    }).select("-passwordHash")

    if (!user) {
      return res
        .status(404)
        .json({ message: "We could not locate the requested account." })
    }

    return res.status(200).json({ user: publicUser(user) })
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return res.status(409).json({
        message:
          "An account with this email address already exists. Please choose a different email address.",
      })
    }

    console.error("Profile update error:", error)
    return res.status(500).json({
      message:
        "We were unable to update your profile at this time. Please try again shortly.",
    })
  }
}
