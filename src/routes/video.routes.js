import e, { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
 } from "../controllers/video.controller.js";

const router = Router()

router.route("/publish").post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        }, 
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    publishAVideo
)
router.route("/search").get(getAllVideos)
router.route("/:videoId")
    .get(getVideoById)
    .patch(verifyJWT, upload.fields([ 
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]), updateVideo)
    .delete(verifyJWT, deleteVideo)
router.route("/:videoId/publish").patch(verifyJWT, togglePublishStatus)

export default router;