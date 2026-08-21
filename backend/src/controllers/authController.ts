import bcrypt from "bcryptjs"
import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { isValidObjectId, type HydratedDocument } from "mongoose"
import { z } from "zod"
import { User, type IUser } from "../models/User.js"
import { sendAdminApprovalEmail } from "../utils/sendMail.js"

const signUpSchema = z.object({
  name: z.string().trim().optional(),
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["user", "admin"]),
})

const logInSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  role: z.enum(["user", "admin"]).optional(),
})

export const signUp = async (req: Request, res: Response) => {
  try {
    const result = signUpSchema.safeParse(req.body)
    if (!result.success) {
      return res
        .status(400)
        .json({ errors: z.flattenError(result.error).fieldErrors }) // a method to display error in simple language
    }

    const { name, email, password, role } = result.data // making a new object for validation

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists with this email" })
    }

    // ID is generated from the email; username comes from the optional name.
    const ID = email.split("@")[0] // split function makes an array, [0] means first index

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    let user: HydratedDocument<IUser> | null = null
    if (role === "user") {
      user = await User.create({
        username: name,
        email,
        ID,
        passwordHash,
        role,
      })
    } else if (role === "admin") {
      user = await User.create({
        username: name,
        email,
        ID,
        passwordHash,
        role,
      })
    }

    if (!user) {
      return res.status(400).json({ message: "User is required!" })
    }

    if (role === "admin") {
      await sendAdminApprovalEmail(user._id.toString(), email, "signup")
      return res.status(202).json({
        message: "Admin signup submitted. Awaiting approval by email.",
      })
    }

    const jwtSecret =
      process.env.JWT_SECRET ||
      "8f4a1c5d9e3b7a0f6c2d8e1b5f0a3c7d9e2b8f4a4a8f9c2d7e1b5f0a3c6d9e2b"
    const token = jwt.sign({ userId: user._id, role: user.role }, jwtSecret, {
      expiresIn: "14d",
    }) // jwt.sign(payload, signature, options), here, the options are also included in the paylod; the header isn't defined, alg is declared HS256 and the type is declared jwt by default

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 14 * 24 * 60 * 60 * 1000,
    })

    return res.status(201).json({
      user: {
        _id: user._id.toString(),
        username: user.username,
        ID: user.ID,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("SignUp Error:", error)
    return res.status(500).json({ message: "Internal server error" })
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

    const { email, password } = result.data

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid Email or Password" })
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Email or Password" })
    }

    if (user.role === "user") {
      // Regular users can log in immediately.
    } else if (user.role === "admin") {
      if (!user.isVerified) {
        await sendAdminApprovalEmail(user._id.toString(), email, "login")
        return res.status(202).json({
          message: "Admin login submitted. Awaiting approval by email.",
        })
      }
    }

    const jwtSecret =
      process.env.JWT_SECRET ||
      "8f4a1c5d9e3b7a0f6c2d8e1b5f0a3c7d9e2b8f4a4a8f9c2d7e1b5f0a3c6d9e2b"

    let token: string | null = null
    if (user.role === "user") {
      token = jwt.sign({ userId: user._id, role: user.role }, jwtSecret, {
        expiresIn: "14d",
      })
    } else if (user.role === "admin") {
      token = jwt.sign({ userId: user._id, role: user.role }, jwtSecret, {
        expiresIn: "14d",
      })
    }

    if (!token) {
      return res.status(403).json({ message: "Invalid user role" })
    }

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.status(200).json({
      user: {
        _id: user._id.toString(),
        username: user.username,
        ID: user.ID,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("LogIn Error:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const verifyAdmin = async (req: Request, res: Response) => {
  const { userId } = req.params
  const action = req.query.action

  if (
    !isValidObjectId(userId) ||
    (action !== "verify" && action !== "reject")
  ) {
    return res.status(400).send("Invalid admin approval link.")
  }

  try {
    const user = await User.findById(userId)
    if (!user || user.role !== "admin") {
      return res.status(404).send("Admin account not found.")
    }

    user.isVerified = action === "verify"
    await user.save()

    return res
      .status(200)
      .send(
        action === "verify"
          ? "Admin access approved. The admin can now log in."
          : "Admin access rejected.",
      )
  } catch (error) {
    console.error("Admin Approval Error:", error)
    return res.status(500).send("Unable to process admin approval.")
  }
}

export const logOut = (_req: Request, res: Response) => {
  res.clearCookie("token")
  return res.status(200).json({ message: "Logged out successfully" })
}

export const getMe = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.token
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" })
    }

    const jwtSecret =
      process.env.JWT_SECRET ||
      "8f4a1c5d9e3b7a0f6c2d8e1b5f0a3c7d9e2b8f4a4a8f9c2d7e1b5f0a3c6d9e2b"
    const payload = jwt.verify(token, jwtSecret) as { userId: string }

    const user = await User.findById(payload.userId).select("-passwordHash")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    return res.status(200).json({ user })
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" })
  }
}
