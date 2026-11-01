import { Document, Schema, model } from "mongoose"

interface IFixture extends Document {
  teamA: string
  teamB: string
  date: Date
  Location: string
  createdAt: Date
  updatedAt: Date
}

const fixtureSchema = new Schema<IFixture>(
  {
    teamA: { type: String, required: true },
    teamB: { type: String, required: true },
    date: { type: Date, required: true },
    Location: { type: String, required: true },
  },
  { timestamps: true },
)

export const Fixture = model<IFixture>("Fixture", fixtureSchema)
