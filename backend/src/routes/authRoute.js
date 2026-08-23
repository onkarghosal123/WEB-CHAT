import { Router } from "express";
import { signUp,logIn,logOut,sendOtp,updateProfilePic } from "../controller/authController.js";
import { checkAuth } from "../middleware/auth.js";
import { upload } from "../lib/multer.js";
import { rateLimit } from "../middleware/ratelimit.js";

const router = Router();
router.post('/signup',signUp);
router.post('/send-otp',rateLimit,sendOtp);
router.post('/login',rateLimit,logIn);
router.post('/logout',logOut)
router.post('/updateprofilepic',checkAuth,upload.single("profilePic"),updateProfilePic)

export default router;