import { Router } from "express"
import {
  getMe,
  logIn,
  logOut,
  newFixture,
  signUp,
} from "../controllers/authController.js"

const router = Router()

router.post("/signup", signUp)
router.post("/login", logIn)
router.post("/logout", logOut)
router.get("/me", getMe)
router.post("/fixture", newFixture)

export default router
