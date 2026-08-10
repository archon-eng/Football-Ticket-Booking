import { Document, Schema, model } from "mongoose"

export interface IUser extends Document {
  username: string
  email: string
  passwordHash: string
  role: "user" | "admin"
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true },
)

export const User = model<IUser>("User", userSchema)
