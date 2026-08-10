import bcrypt from "bcryptjs"
import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { z } from "zod"
import { User } from "../models/User.js"

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const logInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const signUp = async (req: Request, res: Response) => {
  try {
    const result = signUpSchema.safeParse(req.body)
    if (!result.success) {
      return res
        .status(400)
        .json({ errors: result.error.flatten().fieldErrors }) // a method to display error in simple language
    }

    const { email, password } = result.data // making a new object for validation

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists with this email" })
    }

    // Extract user ID/username from email before @ symbol
    const username = email.split("@")[0] // split function makes an array, [0] means first index

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = await User.create({
      username,
      email,
      passwordHash,
    })

    const jwtSecret =
      process.env.JWT_SECRET ||
      "8f4a1c5d9e3b7a0f6c2d8e1b5f0a3c7d9e2b8f4a4a8f9c2d7e1b5f0a3c6d9e2b"
    const token = jwt.sign({ userId: user._id, role: user.role }, jwtSecret, {
      expiresIn: "7d",
    }) // jwt.sign(payload, signature, options), here, the options are also included in the paylod; the header isn't defined, alg is declared HS256 and the type is declared jwt by default

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
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

    const jwtSecret =
      process.env.JWT_SECRET ||
      "8f4a1c5d9e3b7a0f6c2d8e1b5f0a3c7d9e2b8f4a4a8f9c2d7e1b5f0a3c6d9e2b"
    const token = jwt.sign({ userId: user._id, role: user.role }, jwtSecret, {
      expiresIn: "7d",
    })

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("LogIn Error:", error)
    return res.status(500).json({ message: "Internal server error" })
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
