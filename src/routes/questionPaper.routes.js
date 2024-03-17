import { Router } from "express";
import verifyJWT from "../middlewares/authorization.middleware.js";
import { listUnverifiedQuestionPaper, verifyQuestionPaper } from "../controllers/questionPaper.controller.js";


const router = Router();



router.route("/list-unverified-question-papers").get(verifyJWT, listUnverifiedQuestionPaper)

router.route("/verify-question-papers").get(verifyJWT,verifyQuestionPaper)


export default router;