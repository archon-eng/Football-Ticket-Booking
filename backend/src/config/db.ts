import mongoose from "mongoose"

export const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI

  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined")
  }

  try {
    await mongoose.connect(MONGO_URI)
    console.log("MONGODB CONNECTED SUCCESSFULLY")
  } catch (error) {
    console.error("ERROR CONNECTING TO MONGODB:", error)
    process.exit(1)
  }
}
