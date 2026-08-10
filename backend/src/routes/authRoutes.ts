import { Router } from "express"
import { getMe, logIn, logOut, signUp } from "../controllers/authController.js"

const router = Router()

router.post("/signup", signUp)
router.post("/login", logIn)
router.post("/logout", logOut)
router.get("/me", getMe)

export default router
