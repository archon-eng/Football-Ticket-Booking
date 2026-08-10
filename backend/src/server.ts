import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import { connectDB } from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173"

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
)

app.use("/api/auth", authRoutes)

const startServer = async () => {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
  })
}

startServer().catch((error) => {
  console.error("Failed to start server:", error)
  process.exit(1)
})
