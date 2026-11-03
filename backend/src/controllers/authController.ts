import bcrypt from "bcryptjs"
import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { type HydratedDocument } from "mongoose"
import { z } from "zod"
import { User, type IUser } from "../models/User.js"
import { sendAdminApprovalEmail } from "../utils/sendMail.js"

const signUpSchema = z.object({
  username: z.string().trim(),
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  role: z.enum(["user", "admin"]),
})

const logInSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  role: z.enum(["user", "admin"]),
})

const fixtureSchema = z.object({
  competition: z.string().trim().min(1, { message: "Competition is required" }),
  home: z.string().trim().min(1, { message: "Team A is required" }),
  away: z.string().trim().min(1, { message: "Team B is required" }),
  date: z.string().refine((date) => isNaN(Date.parse(date)) === false, {
    message: "Invalid date format",
  }),
  time: z.string().trim().min(1, { message: "Time is required" }),
  venue: z.string().trim().min(1, { message: "Location is required" }),
})

export const signUp = async (req: Request, res: Response) => {
  try {
    const result = signUpSchema.safeParse(req.body)
    if (!result.success) {
      return res
        .status(400)
        .json({ errors: z.flattenError(result.error).fieldErrors }) // a method to display error in simple language
    }

    const { username, email, password, role } = result.data // making a new object for validation

    const passwordHash = await bcrypt.hash(password, 10)

    const name = username === "" ? email.split("@")[0] : username

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists with this email" })
    }

    let user: HydratedDocument<IUser> | null = null
    if (role === "user") {
      user = await User.create({
        username: name,
        email,
        passwordHash,
        role,
      })
    } else if (role === "admin") {
      user = await User.create({
        username: name,
        email,
        passwordHash,
        role,
      })

      if (email !== process.env.EMAIL_TO) {
        await sendAdminApprovalEmail(email, user._id.toString(), "signup")
        return res.status(202).json({
          message: "Admin signup approval request sent.",
        })
      }
    }

    if (!user) {
      return res.status(400).json({ message: "User is required!" })
    }

    const stringifyJWTSecret = (): string => {
      const jwtSecret = process.env.JWT_SECRET
      if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined in environment variables")
      }
      return jwtSecret
    }

    // It converts the JWT_SECRET from type "string | undefined" to type "string" to elimnate typescript error of being undefined
    const jwtSecret = stringifyJWTSecret()

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

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid Email or Password" })
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Email or Password" })
    }

    if (user.role === "admin") {
      if (email !== process.env.EMAIL_TO) {
        await sendAdminApprovalEmail(email, user._id.toString(), "login")
        return res.status(202).json({
          message: "Admin login approval request sent.",
        })
      }
    }

    const stringifyJWTSecret = (): string => {
      const jwtSecret = process.env.JWT_SECRET
      if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined in environment variables")
      }
      return jwtSecret
    }

    // It converts the JWT_SECRET from type "string | undefined" to type "string" to elimnate typescript error of being undefined
    const jwtSecret = stringifyJWTSecret()

    let token: string = jwt.sign(
      { userId: user._id, role: user.role },
      jwtSecret,
      { expiresIn: "14d" },
    )

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
        username: user.username,
        email: user.email,
        _id: user._id.toString(),
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

    const stringifyJWTSecret = (): string => {
      const jwtSecret = process.env.JWT_SECRET
      if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined in environment variables")
      }
      return jwtSecret
    }

    // It converts the JWT_SECRET from type "string | undefined" to type "string" to elimnate typescript error of being undefined
    const jwtSecret = stringifyJWTSecret()
    const payload = jwt.verify(token, jwtSecret) as { userId: string }

    // A place to resolve errors
    const user = await User.findById(payload.userId).select("-passwordHash") // Exclude the passwordHash field from the response

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    return res.status(200).json({ user })
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" })
  }
}

export const newFixture = async (req: Request, res: Response) => {
  const result = fixtureSchema.safeParse(req.body)
  if (!result.success) {
    return res
      .status(400)
      .json({ errors: z.flattenError(result.error).fieldErrors })
  }

  const { competition, home, away, date, time, venue } = result.data
}
