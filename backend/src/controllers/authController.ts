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
  setAuthCookie,
} from "../utils/auth.js"
import { sendAdminApprovalEmail } from "../utils/sendMail.js"

const emailSchema = z
  .string()
  .trim()
  .pipe(z.email({ message: "Enter a valid email address." }))
  .transform((email) => email.toLowerCase())

const signUpSchema = z.object({
  username: z.string().trim().max(64),
  email: emailSchema,
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
  role: z.enum(["user", "admin"]),
})

const logInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Enter your password." }),
  role: z.enum(["user", "admin"]),
})

const profileUpdateSchema = z.strictObject({
  username: z.string().trim().min(1, { message: "Enter your name." }).max(64),
  email: emailSchema,
})

const isDuplicateKeyError = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  error.code === 11000

const publicUser = (user: Pick<IUser, "_id" | "username" | "email" | "role">) => ({
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
  const form =
    token && action
      ? `<form method="post" action="/api/auth/verify-admin/${token}"><input type="hidden" name="action" value="${action}"><button type="submit">Confirm ${action}</button></form>`
      : ""

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title></head><body><main><h1>${title}</h1><p>${message}</p>${form}</main></body></html>`
}

export const signUp = async (req: Request, res: Response) => {
  try {
    const result = signUpSchema.safeParse(req.body)
    if (!result.success) {
      return res
        .status(400)
        .json({ errors: z.flattenError(result.error).fieldErrors })
    }

    const { username, email, password, role } = result.data
    const name = (username || email.split("@")[0]).slice(0, 64)

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "An account with this email address already exists." })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    if (role === "admin") {
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
        await User.findByIdAndDelete(user._id)
        throw error
      }

      return res.status(202).json({
        message:
          "Your administrator account request has been submitted for review.",
      })
    }

    const user = await User.create({ username: name, email, passwordHash, role })
    setAuthCookie(res, createAuthToken(user._id.toString(), user.role))
    return res.status(201).json({ user: publicUser(user) })
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return res
        .status(409)
        .json({ message: "An account with this email address already exists." })
    }
    console.error("SignUp Error:", error)
    return res
      .status(500)
      .json({
        message: "We couldn't complete your request. Please try again shortly.",
      })
  }
}
export const logIn = async (req: Request, res: Response) => {
  try {
    const result = logInSchema.safeParse(req.body)
    if (!result.success) {
      return res
        .status(400)
        .json({ errors: result.error.flatten().fieldErrors })
    }

    const { email, password, role } = result.data

    const user = await User.findOne({ email }).select(
      "+adminApproved +adminApprovalTokenHash +adminApprovalExpiresAt",
    )
    if (!user) {
      return res.status(401).json({
        message:
          "We couldn't verify those credentials. Check your email and password, then try again.",
      })
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch || user.role !== role) {
      return res.status(401).json({
        message:
          "We couldn't verify those credentials. Check your email and password, then try again.",
      })
    }

    if (user.role === "admin" && user.adminApproved !== true) {
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
          user.adminApprovalTokenHash = undefined
          user.adminApprovalExpiresAt = undefined
          await user.save()
          throw error
        }

        return res.status(202).json({
          message:
            "A new administrator access review request has been sent for approval.",
        })
      }

      return res.status(202).json({
        message:
          "Your administrator account request is still awaiting approval.",
      })
    }

    setAuthCookie(res, createAuthToken(user._id.toString(), user.role))
    return res.status(200).json({ user: publicUser(user) })
  } catch (error) {
    console.error("LogIn Error:", error)
    return res
      .status(500)
      .json({
        message:
          "We couldn't complete your sign-in. Please try again shortly.",
      })
  }
}

export const logOut = (_req: Request, res: Response) => {
  clearAuthCookie(res)
  return res.status(200).json({ message: "You have been signed out." })
}

export const getMe = (req: Request, res: Response) => {
  if (!req.auth) {
    return res.status(401).json({ message: "Please sign in to continue." })
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
    return res.status(400).type("html").send(
      approvalPage(
        "Invalid approval request",
        "This administrator approval link is invalid.",
      ),
    )
  }

  try {
    const request = await User.exists(pendingAdminApprovalQuery(token))
    if (!request) {
      return res.status(410).type("html").send(
        approvalPage(
          "Approval request expired",
          "This administrator approval request has expired or was already handled.",
        ),
      )
    }

    return res
      .status(200)
      .type("html")
      .send(
        approvalPage(
          action === "approve" ? "Approve administrator" : "Decline administrator",
          `Confirm that you want to ${action} this administrator account request.`,
          token,
          action,
        ),
      )
  } catch (error) {
    console.error("Admin approval review failed:", error)
    return res.status(500).type("html").send(
      approvalPage(
        "Approval unavailable",
        "We couldn't load this approval request. Please try again later.",
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
    return res.status(400).type("html").send(
      approvalPage(
        "Invalid approval request",
        "This administrator approval request is invalid.",
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
      return res.status(410).type("html").send(
        approvalPage(
          "Approval request expired",
          "This administrator approval request has expired or was already handled.",
        ),
      )
    }

    return res.status(200).type("html").send(
      approvalPage(
        action === "approve" ? "Administrator approved" : "Request declined",
        action === "approve"
          ? "The administrator account is now active."
          : "The administrator account request has been declined.",
      ),
    )
  } catch (error) {
    console.error("Admin approval completion failed:", error)
    return res.status(500).type("html").send(
      approvalPage(
        "Approval unavailable",
        "We couldn't process this approval request. Please try again later.",
      ),
    )
  }
}

export const updateProfile = async (req: Request, res: Response) => {
  const userId = req.auth?.userId
  if (!userId) {
    return res.status(401).json({ message: "Please sign in to continue." })
  }

  const result = profileUpdateSchema.safeParse(req.body)
  if (!result.success) {
    return res
      .status(400)
      .json({ errors: z.flattenError(result.error).fieldErrors })
  }

  try {
    const user = await User.findByIdAndUpdate(userId, result.data, {
      new: true,
      runValidators: true,
    }).select("-passwordHash")

    if (!user) {
      return res.status(404).json({ message: "We couldn't find this account." })
    }

    return res.status(200).json({ user: publicUser(user) })
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return res
        .status(409)
        .json({ message: "An account with this email address already exists." })
    }

    console.error("Profile update error:", error)
    return res.status(500).json({
      message: "We couldn't update your profile. Please try again shortly.",
    })
  }
}
