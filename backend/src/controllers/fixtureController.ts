import type { Request, Response } from "express"
import { Types } from "mongoose"
import { z } from "zod"
import { Fixture } from "../models/Fixtures.js"

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

export const newFixture = async (req: Request, res: Response) => {
  try {
    const result = fixtureSchema.safeParse(req.body)
    if (!result.success) {
      return res
        .status(400)
        .json({ errors: z.flattenError(result.error).fieldErrors })
    }

    const existingFixture = await Fixture.findOne(result.data)
    if (existingFixture) {
      return res
        .status(409)
        .json({ message: "A fixture with these details already exists." })
    }

    const fixture = await Fixture.create(result.data)

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
    console.error("Fixture creation error:", error)
    return res.status(500).json({
      message: "We couldn't save the fixture. Please try again shortly.",
    })
  }
}

export const updateFixture = async (req: Request, res: Response) => {
  const fixtureId = req.params.id
  if (typeof fixtureId !== "string" || !Types.ObjectId.isValid(fixtureId)) {
    return res.status(400).json({ message: "The fixture ID is invalid." })
  }

  const result = fixtureSchema.safeParse(req.body)
  if (!result.success) {
    return res
      .status(400)
      .json({ errors: z.flattenError(result.error).fieldErrors })
  }

  try {
    const duplicate = await Fixture.findOne({
      ...result.data,
      _id: { $ne: fixtureId },
    })
    if (duplicate) {
      return res
        .status(409)
        .json({ message: "A fixture with these details already exists." })
    }

    const fixture = await Fixture.findByIdAndUpdate(fixtureId, result.data, {
      new: true,
      runValidators: true,
    })
    if (!fixture) {
      return res.status(404).json({ message: "We couldn't find this fixture." })
    }

    return res.status(200).json({ fixture })
  } catch (error) {
    console.error("Fixture update error:", error)
    return res.status(500).json({
      message: "We couldn't update the fixture. Please try again shortly.",
    })
  }
}

export const deleteFixture = async (req: Request, res: Response) => {
  const fixtureId = req.params.id
  if (typeof fixtureId !== "string" || !Types.ObjectId.isValid(fixtureId)) {
    return res.status(400).json({ message: "The fixture ID is invalid." })
  }

  try {
    const fixture = await Fixture.findByIdAndDelete(fixtureId)
    if (!fixture) {
      return res.status(404).json({ message: "We couldn't find this fixture." })
    }

    return res.status(200).json({ message: "Fixture deleted successfully." })
  } catch (error) {
    console.error("Fixture deletion error:", error)
    return res.status(500).json({
      message: "We couldn't delete the fixture. Please try again shortly.",
    })
  }
}

export const getFixtures = async (_req: Request, res: Response) => {
  try {
    const fixtures = await Fixture.find().sort({ date: 1, time: 1 })
    return res.status(200).json({ fixtures })
  } catch (error) {
    console.error("Fixture retrieval error:", error)
    return res.status(500).json({
      message: "We couldn't load fixtures. Please try again shortly.",
    })
  }
}
