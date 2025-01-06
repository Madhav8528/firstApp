import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { addVideoToPlaylist, 
         createPlaylist,
         deletePlaylist, 
         getPlaylistById, 
         getUserPlaylist, 
         removeVideoFromPlaylist, 
         updatePlaylist } from "../controllers/playlist.controller.js";


const router = Router()

router.use(verifyJwt)

router.route("/").post(createPlaylist)

router.route("/user/:userId").get(getUserPlaylist)

router.route("/:playlistId")
.get(getPlaylistById)
.patch(updatePlaylist)
.delete(deletePlaylist)

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist)
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist)

export default router;