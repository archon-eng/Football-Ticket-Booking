import { type User } from "./AuthContext"

export default function validateUserCredentials(data: unknown): User {
  if (typeof data !== "object" || !data) {
    throw new Error("Invalid user payload: payload is empty or not an object.")
  }

  const user = data as Record<string, unknown>

  if (typeof user.email !== "string" || !user.email) {
    throw new Error(
      "Invalid user payload: missing required property 'email' or invalid type.",
    )
  }
  if (typeof user._id !== "string" || !user._id) {
    throw new Error(
      "Invalid user payload: missing required property '_id' or invalid type.",
    )
  }
  if (user.role !== "user" && user.role !== "admin") {
    throw new Error(
      "Invalid user payload: missing required property 'role' orinvalid type..",
    )
  }
  if (typeof user.username !== "string") {
    throw new Error("Invalid user payload: Type of 'username' is invalid.")
  }
  const finalUsername = user.username.trim()

  return {
    username: finalUsername,
    email: user.email,
    _id: user._id,
    role: user.role,
  }
}
