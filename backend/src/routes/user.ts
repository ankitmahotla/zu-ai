import { Router } from "express"
import { loginUser, refreshAccessToken, registerUser } from "../controllers/user"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/refreshToken").post(refreshAccessToken)

export default router;