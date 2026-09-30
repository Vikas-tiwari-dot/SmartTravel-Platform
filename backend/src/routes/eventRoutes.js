import { Router } from "express";
import { listActiveEvents, reportEvent } from "../controllers/eventController.js";
import { protect } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { reportEventSchema } from "../utils/validators.js";

const router = Router();

router.get("/", protect, listActiveEvents);
router.post("/", protect, validateBody(reportEventSchema), reportEvent);

export default router;
