import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { deleteVideo,
         getAllVideos, 
         getVideoByID, 
         publishVideo, 
         togglePublishStatus,
         updateVideo } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

router.use(verifyJwt)

router.route("/")
.get(getAllVideos)
.post(upload.fields([
    {
            name : "videoFile",
            maxCount : 1
    },
    {
        name : "thumbnail",
        maxCount : 2
    }
]), publishVideo)

router.route("/:videoId")
.patch(updateVideo)
.delete(deleteVideo)
.get(getVideoByID)

router.route("/toggle-publish/:videoId").patch(togglePublishStatus)


export default router;