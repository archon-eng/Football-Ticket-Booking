import { Document, Schema, model } from "mongoose"

export interface IUser extends Document {
  username: string
  email: string
  ID: string
  passwordHash: string
  role: String
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, trim: true },
    ID: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"] },
    isVerified: { type: Boolean, default: (doc: IUser) => doc.role === "user" },
  },
  { timestamps: true },
)

export const User = model<IUser>("User", userSchema)
