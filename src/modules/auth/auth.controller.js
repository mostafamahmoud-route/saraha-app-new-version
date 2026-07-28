import { Router } from "express";
import { login, signinWithGoogle, signUp } from "./auth.service.js";

const router = Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/google-login", signinWithGoogle);

export default router;
