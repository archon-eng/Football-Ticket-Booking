// backend/src/server.ts
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import http from "http"
import { Server } from "socket.io"
import { connectDB } from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"

dotenv.config()

const app = express()

const PORT = process.env.PORT || 5000
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173"
const server = http.createServer(app)

export const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
  },
})

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
)

app.use("/api/auth", authRoutes)

// Real-time seat reservation socket listeners
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`)

  socket.on("join:match", (matchId: string) => {
    socket.join(matchId)
  })

  socket.on("seat:select", ({ matchId, seatId, userId }) => {
    socket.to(matchId).emit("seat:locked", { seatId, lockedBy: userId })
  })

  socket.on("seat:deselect", ({ matchId, seatId }) => {
    socket.to(matchId).emit("seat:unlocked", { seatId })
  })

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`)
  })
})

const startServer = async () => {
  await connectDB()

  server.listen(PORT, () => {
    console.log(`Server & WebSockets listening on port ${PORT}`)
  })
}

startServer().catch((error) => {
  console.error("Failed to start server:", error)
  process.exit(1)
})
