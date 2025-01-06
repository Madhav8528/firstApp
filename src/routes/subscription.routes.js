import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { getChannelSubscriber, toggleSubscription, userSubscription } from "../controllers/subscription.controller.js";


const router = Router()

router.use(verifyJwt)

router.route("/c/:channelId")
.post(toggleSubscription)
.get(getChannelSubscriber)

router.route("/u/:subscriberId").get(userSubscription)

export default router;