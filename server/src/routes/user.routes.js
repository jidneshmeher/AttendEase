import { Router } from "express";
import {signIn} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.js";

const router = Router()

router.post("/sign-in",upload.none(),signIn)

export default router