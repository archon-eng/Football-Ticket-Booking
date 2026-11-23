import mongoose from "mongoose"

export const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI

  if (!MONGO_URI) {
    throw new Error(
      "The database connection is not configured. Please provide a valid MongoDB connection string.",
    )
  }

  try {
    await mongoose.connect(MONGO_URI)
    console.log("MongoDB connection established successfully.")
  } catch (error) {
    console.error("Unable to establish a MongoDB connection:", error)
    process.exit(1)
  }
}
