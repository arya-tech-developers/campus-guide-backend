import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";


const router = Router()

router.route("/registration").post(registerUser);
router.route("/registration").get(registerUser);


export default router;