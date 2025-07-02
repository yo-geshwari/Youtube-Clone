import { Router } from "express";
import {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/likeVideo/:videoId").post(verifyJWT, toggleVideoLike);
router.route("/likeComment/:commentId").post(verifyJWT, toggleCommentLike);
router.route("/likeTweet/:tweetId").post(verifyJWT, toggleTweetLike);
router.route("/likedVideos").get(verifyJWT, getLikedVideos);

export default router;