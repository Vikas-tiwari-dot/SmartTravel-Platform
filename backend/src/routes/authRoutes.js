import { Router } from "express";
import { signup, login, logout, me } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { signupSchema, loginSchema } from "../utils/validators.js";

const router = Router();

router.post("/signup", validateBody(signupSchema), signup);
router.post("/login", validateBody(loginSchema), login);
router.post("/logout", logout);
router.get("/me", protect, me);

export default router;
