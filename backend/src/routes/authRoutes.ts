import { Router } from "express"
import {
  getFixtures,
  getMe,
  logIn,
  logOut,
  newFixture,
  signUp,
  updateFixture,
  updateProfile,
  deleteFixture,
} from "../controllers/authController.js"
import { authenticate, requireAdmin } from "../middleware/authentication.js"

const router = Router()

router.post("/signup", signUp)
router.post("/login", logIn)
router.post("/logout", logOut)
router.get("/me", getMe)
router.patch("/profile", authenticate, updateProfile)
router.post("/fixture", authenticate, requireAdmin, newFixture)
router.put("/fixture/:id", authenticate, requireAdmin, updateFixture)
router.delete("/fixture/:id", authenticate, requireAdmin, deleteFixture)
router.get("/get_fixtures", getFixtures)

export default router
