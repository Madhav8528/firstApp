import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller";

const router = Router()
router.use(verifyJwt)

router.route("/v/:videoId").post(toggleVideoLike)
router.route("/c/:commentId").post(toggleCommentLike)
router.route("/t/:tweetId").post(toggleTweetLike)
router.route("/liked-videos").get(getLikedVideos)

export default router;