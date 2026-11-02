import { Document, Schema, model } from "mongoose"

interface IFixture extends Document {
  competition: string
  home: string
  away: string
  date: Date
  time: string
  venue: string
  Location: string
  createdAt: Date
  updatedAt: Date
}

const fixtureSchema = new Schema<IFixture>(
  {
    competition: { type: String, required: true },
    home: { type: String, required: true },
    away: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    Location: { type: String, required: true },
  },
  { timestamps: true },
)

export const Fixture = model<IFixture>("Fixture", fixtureSchema)
