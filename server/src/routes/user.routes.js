import { Router } from "express";
import {signUp,signIn,logout} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";

const router = Router()

router.post("/sign-up",upload.none(),signUp)
router.post("/sign-in",upload.none(),signIn)
router.post("/logout",verifyJWT,  logout)

export default router