import { Router } from "express"
import {
  completeAdminApproval,
  getMe,
  logIn,
  logOut,
  reviewAdminApproval,
  signUp,
  updateProfile,
} from "../controllers/authController.js"
import {
  deleteFixture,
  getFixtures,
  newFixture,
  updateFixture,
} from "../controllers/fixtureController.js"
import { authenticate, requireAdmin } from "../middleware/authentication.js"

const router = Router()

router.post("/signup", signUp)
router.post("/login", logIn)
router.post("/logout", logOut)
router.get("/me", authenticate, getMe)
router.get("/verify-admin/:token", reviewAdminApproval)
router.post("/verify-admin/:token", completeAdminApproval)
router.patch("/profile", authenticate, updateProfile)
router.post("/fixture", authenticate, requireAdmin, newFixture)
router.put("/fixture/:id", authenticate, requireAdmin, updateFixture)
router.delete("/fixture/:id", authenticate, requireAdmin, deleteFixture)
router.get("/get_fixtures", getFixtures)

export default router
