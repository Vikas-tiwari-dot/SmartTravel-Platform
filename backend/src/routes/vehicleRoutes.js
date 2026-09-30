import { Router } from "express";
import { updatePosition, clearPosition, getNearbyVehicles } from "../controllers/vehicleController.js";
import { protect } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { updatePositionSchema } from "../utils/validators.js";

const router = Router();

router.use(protect);
router.get("/nearby", getNearbyVehicles);
router.post("/position", validateBody(updatePositionSchema), updatePosition);
router.delete("/position", clearPosition);

export default router;
