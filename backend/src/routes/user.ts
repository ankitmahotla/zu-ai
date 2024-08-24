import { Router } from "express";
import {
  checkUsername,
  loginUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refreshToken").post(refreshAccessToken);
router.route("/check-username").get(checkUsername);

export default router;
