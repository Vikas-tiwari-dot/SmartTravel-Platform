import { Router } from "express";
import { getConversation, sendMessage } from "../controllers/messageController.js";
import { protect } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { sendMessageSchema } from "../utils/validators.js";

const router = Router();

router.use(protect);
router.get("/:vehicleId", getConversation);
router.post("/", validateBody(sendMessageSchema), sendMessage);

export default router;
