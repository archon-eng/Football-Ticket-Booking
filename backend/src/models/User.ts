import { Document, Schema, model } from "mongoose"

export type UserRole = "user" | "admin"

export interface IUser extends Document {
  username: string
  email: string
  passwordHash: string
  role: UserRole
  bookingHistory?: string[] | null
  adminApproved?: boolean
  adminApprovalTokenHash?: string
  adminApprovalExpiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, trim: true, maxlength: 64 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], required: true },
    adminApproved: { type: Boolean, select: false },
    adminApprovalTokenHash: { type: String, select: false },
    adminApprovalExpiresAt: { type: Date, select: false },
  },
  { timestamps: true },
)

export const User = model<IUser>("User", userSchema)
