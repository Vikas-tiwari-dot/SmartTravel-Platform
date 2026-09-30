import { Router } from "express";
import {
  listNearbyEntries,
  createEntry,
  requestRide,
  listCommunityRequests,
  createCommunityRequest,
} from "../controllers/rideCircleController.js";
import { protect } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { createRideEntrySchema, communityRequestSchema } from "../utils/validators.js";

const router = Router();

router.use(protect);
router.get("/", listNearbyEntries);
router.post("/", validateBody(createRideEntrySchema), createEntry);
router.post("/:id/request", requestRide);

router.get("/community/requests", listCommunityRequests);
router.post("/community/requests", validateBody(communityRequestSchema), createCommunityRequest);

export default router;
