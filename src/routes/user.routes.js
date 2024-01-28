import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { dbtest } from "../controllers/test.controller.js";


const router = Router()

router.route("/registration").post(registerUser);


export default router;