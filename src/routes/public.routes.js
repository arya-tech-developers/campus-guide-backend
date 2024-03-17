import { Router } from "express";


const router = Router()


router.route("/test").get(()=><h1>Server Running </h1>)


export default router;