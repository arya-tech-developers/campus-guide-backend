import { Router } from "express";
import { logoutUser,loginUser, registerUser, refreshAccessToken } from "../controllers/user.controller.js";
import { uploadQuestionPaper } from "../controllers/questionPaper.controller.js";
import verifyJWT from "../middlewares/authorization.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()


router.route("/registration").post(registerUser)
router.route("/login").get(loginUser)

// secured routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-session").post(refreshAccessToken)

// resources routes
router.route("/upload-question-paper").post(upload.single("questionPaper"),verifyJWT,uploadQuestionPaper)

export default router;

