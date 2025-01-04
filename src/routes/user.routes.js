import { Router } from "express";

import  {loginUser,
         logOutUser,
         registerUser,
         refreshAccessToken, 
         changeCurrentPassword,
         getCurrentUser,
         updateAccountDetails,
         updateAvatar,
         updateCoverImage,
         getUserProfile,
         getWatchHistory}  from "../controllers/user.controller.js"
         
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ])
    ,registerUser);

router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJwt, logOutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-current-password").post(verifyJwt,changeCurrentPassword)
router.route("/get-current-user").get(verifyJwt,getCurrentUser)
router.route("/update-account-details").patch(verifyJwt, updateAccountDetails)
router.route("/update-avatar").patch(verifyJwt, upload.single("avatar"), updateAvatar)
router.route("/update-cover-image").patch(verifyJwt, upload.single("coverImage"), updateCoverImage)
router.route("/c/:username").get(verifyJwt, getUserProfile)
router.route("/watch-history").get(verifyJwt, getWatchHistory)

export default router;