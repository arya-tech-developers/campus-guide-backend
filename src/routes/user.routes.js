import { Router } from "express";
import { logoutUser,loginUser, registerUser, refreshAccessToken } from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/authorization.middleware.js";

const router = Router()


router.route("/registration").post(registerUser)
router.route("/login").get(loginUser)

// secured routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-session").post(refreshAccessToken)

export default router;

