import { type User } from "./AuthContext"

export function validateUserCredentials(data: unknown): User {
  if (typeof data !== "object" || !data) {
    throw new Error("Invalid user payload: payload is empty or not an object.")
  }

  const user = data as Record<string, unknown>

  if (typeof user._id !== "string" || !user._id) {
    throw new Error(
      "Invalid user payload: missing required property '_id' or invalid type.",
    )
  }
  if (typeof user.email !== "string" || !user.email) {
    throw new Error(
      "Invalid user payload: missing required property 'email' or invalid type.",
    )
  }
  if (typeof user.ID !== "string" || !user.ID) {
    throw new Error(
      "Invalid user payload: missing required property 'ID' or invalid type.",
    )
  }
  if (
    typeof user.role !== "string" ||
    !["admin", "user"].includes(user.role) ||
    !user.role
  ) {
    throw new Error(
      "Invalid user payload: missing required property 'role' orinvalid type..",
    )
  }
  if (typeof user.username !== "string") {
    throw new Error("Invalid user payload: Type of 'username' is invalid.")
  }
  const finalUsername =
    user.username.trim() === "" ? "no_username" : user.username

  return {
    _id: user._id,
    username: finalUsername,
    email: user.email,
    ID: user.ID,
    role: user.role,
  }
}
