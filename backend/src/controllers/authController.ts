import bcrypt from "bcryptjs"
import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { type HydratedDocument } from "mongoose"
import { z } from "zod"
import { Fixture, type IFixture } from "../models/Fixtures.js"
import { User, type IUser } from "../models/User.js"
import { sendAdminApprovalEmail } from "../utils/sendMail.js"

const signUpSchema = z.object({
  username: z.string().trim(),
  email: z.email({ message: "Enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
  role: z.enum(["user", "admin"]),
})

const logInSchema = z.object({
  email: z.email({ message: "Enter a valid email address." }),
  password: z.string().min(1, { message: "Enter your password." }),
  role: z.enum(["user", "admin"]),
})

const fixtureSchema = z.object({
  competition: z
    .string()
    .trim()
    .min(1, { message: "Enter the competition name." }),
  home: z.string().trim().min(1, { message: "Enter the home team." }),
  away: z.string().trim().min(1, { message: "Enter the away team." }),
  date: z.string().refine((date) => isNaN(Date.parse(date)) === false, {
    message: "Enter a valid date.",
  }),
  time: z.string().trim().min(1, { message: "Enter a match time." }),
  venue: z.string().trim().min(1, { message: "Enter a venue." }),
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
        .json({ message: "An account with this email address already exists." })
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
          message:
            "Your administrator account request has been submitted for review.",
        })
      }
    }

    if (!user || user === null) {
      return res.status(400).json({ message: "Account details are required." })
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
        username: user.username,
        email: user.email,
        _id: user._id.toString(),
        role: user.role,
      },
    })
  } catch (error) {
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

    const user = await User.findOne({ email })
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

    if (user.role === "admin") {
      if (email !== process.env.EMAIL_TO) {
        await sendAdminApprovalEmail(email, user._id.toString(), "login")
        return res.status(202).json({
          message:
            "Your administrator sign-in request has been submitted for approval.",
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
      return res.status(403).json({
        message:
          "We couldn't verify those credentials. Check your email and password, then try again.",
      })
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
    return res
      .status(500)
      .json({
        message:
          "We couldn't complete your sign-in. Please try again shortly.",
      })
  }
}

export const logOut = (_req: Request, res: Response) => {
  res.clearCookie("token")
  return res.status(200).json({ message: "You have been signed out." })
}

export const getMe = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.token
    if (!token) {
      return res.status(401).json({ message: "Please sign in to continue." })
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
      return res.status(404).json({ message: "We couldn't find this account." })
    }

    return res.status(200).json({ user })
  } catch (error) {
    return res
      .status(401)
      .json({
        message: "Your session is no longer valid. Please sign in again.",
      })
  }
}

export const newFixture = async (req: Request, res: Response) => {
  try {
    const result = fixtureSchema.safeParse(req.body)
    if (!result.success) {
      return res
        .status(400)
        .json({ errors: z.flattenError(result.error).fieldErrors })
    }

    const { competition, home, away, date, time, venue } = result.data

    const existingFixture = await Fixture.findOne({
      competition,
      home,
      away,
      date,
      time,
      venue,
    })
    if (existingFixture) {
      return res
        .status(409)
        .json({ message: "A fixture with these details already exists." })
    }

    let fixture: HydratedDocument<IFixture> | null = null
    fixture = await Fixture.create({
      competition,
      home,
      away,
      date,
      time,
      venue,
    })

    if (!fixture || fixture === null) {
      return res.status(400).json({ message: "Fixture details are required." })
    }

    return res.status(201).json({
      fixture: {
        competition: fixture.competition,
        home: fixture.home,
        away: fixture.away,
        date: fixture.date,
        time: fixture.time,
        venue: fixture.venue,
        _id: fixture._id.toString(),
      },
    })
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "We couldn't save the fixture. Please try again shortly.",
      })
  }
}

export const getFixtures = async (_req: Request, res: Response) => {
  try {
    const fixtures = await Fixture.find().sort({ date: 1, time: 1 })
    return res.status(200).json({ fixtures })
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "We couldn't load fixtures. Please try again shortly.",
      })
  }
}
