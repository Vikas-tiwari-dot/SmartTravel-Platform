import { Router } from "express";
import { createTripPlan, getRecentTrips, startTrip, completeTrip } from "../controllers/tripController.js";
import { protect } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { planTripSchema } from "../utils/validators.js";

const router = Router();

router.use(protect);
router.post("/plan", validateBody(planTripSchema), createTripPlan);
router.get("/recent", getRecentTrips);
router.patch("/:id/start", startTrip);
router.patch("/:id/complete", completeTrip);

export default router;
