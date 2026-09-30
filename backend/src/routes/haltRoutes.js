import { Router } from "express";
import { listHalts, createHalt, removeHalt, completeHalt } from "../controllers/haltController.js";
import { protect } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { createHaltSchema } from "../utils/validators.js";

const router = Router();

router.use(protect);
router.get("/", listHalts);
router.post("/", validateBody(createHaltSchema), createHalt);
router.delete("/:id", removeHalt);
router.patch("/:id/complete", completeHalt);

export default router;
