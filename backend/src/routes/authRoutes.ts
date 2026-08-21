import { Router } from "express"
import {
  getMe,
  logIn,
  logOut,
  signUp,
  verifyAdmin,
} from "../controllers/authController.js"

const router = Router()

router.post("/signup", signUp)
router.post("/login", logIn)
router.post("/logout", logOut)
router.get("/me", getMe)
router.get("/verify-admin/:userId", verifyAdmin)

export default router
