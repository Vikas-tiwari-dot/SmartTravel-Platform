import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { updateProfileSchema } from "../utils/validators.js";

const router = Router();

router.use(protect);
router.get("/me", getProfile);
router.put("/me", validateBody(updateProfileSchema), updateProfile);

export default router;
