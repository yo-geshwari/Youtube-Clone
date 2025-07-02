import { Router } from "express";
import { toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels } from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/:channelId", toggleSubscription);
router.get("/:channelId/subscribers", getUserChannelSubscribers);
router.get("/:channelId/subscriptions", getSubscribedChannels);

export default router;