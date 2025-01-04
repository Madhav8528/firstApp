import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { Like } from "../models/like.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    
    const { videoID } = req.params
    if(!videoID){
        throw new ApiError(400, "Something wrong with url!")
    }
    if(!(req.user)){
        throw new ApiError(400, "Login is required to like the video")
    }

    const existingLike = await Like.findOne({
        video : videoID,
        likedBy : req.user._id
    })
    if(existingLike){
        await existingLike.deleteOne()
        return res.status(200)
        .json(
            new ApiResponse(200, "Video disliked successfully")
        )
    }
    
    const like = await Like.create({
        video : videoID,
        likedBy : req.user._id
    })
    if(!like){
        throw new ApiError(400, "Something went wrong!")
    }

    return res.status(201)
    .json(
        new ApiResponse(201, like, "Video Liked successfully")
    )
})

const toggleCommentLike = asyncHandler( async (req, res) => {
    
    const { commentId } = req.params
    if(!commentId){
        throw new ApiError(400, "Something wrong with url!")
    }
    if(!(req.user)){
        throw new ApiError(400, "Login is required to like the comment")
    }

    const existingLike = await Like.findOne({
        comment : commentId,
        likedBy : req.user._id
    })
    if(existingLike){
        await existingLike.deleteOne()
        return res.status(200)
        .json(
            new ApiResponse(200, "Comment disliked successfully")
        )
    }
    
    const like = await Like.create({
        comment : commentId,
        likedBy : req.user._id
    })
    if(!like){
        throw new ApiError(400, "Something went wrong!")
    }

    return res.status(201)
    .json(
        new ApiResponse(201, like, "Comment Liked successfully")
    )
})

const toggleTweetLike = asyncHandler( async (req, res) => {
    
    const { tweetId } = req.params
    if(!tweetId){
        throw new ApiError(400, "Something wrong with url!")
    }
    if(!(req.user)){
        throw new ApiError(400, "Login is required to like the tweet")
    }

    const existingLike = await Like.findOne({
        tweet : tweetId,
        likedBy : req.user._id
    })
    if(existingLike){
        await existingLike.deleteOne()
        return res.status(200)
        .json(
            new ApiResponse(200, "Tweet disliked successfully")
        )
    }
    
    const like = await Like.create({
        tweet : tweetId,
        likedBy : req.user._id
    })
    if(!like){
        throw new ApiError(400, "Something went wrong!")
    }

    return res.status(201)
    .json(
        new ApiResponse(201, like, "Tweet Liked successfully")
    )
})

const getLikedVideos = asyncHandler( async (req, res) => {
    
    if(!(req.user)){
        throw new ApiError(401, "Please login to get your liked videos")
    }

    const likedVideos = await Like.find({
        likedBy : req.user._id
    })
    .populate("video", "_id title thumbnail description ")
    .select("video")

    if(!likedVideos){
        throw new ApiError(404, "Unable to get liked videos")
    }
    if(likedVideos.length === 0){
        throw new ApiError(404, "No liked video found")
    }
    return res.status(200)
    .json(
        new ApiResponse(200, likedVideos, "Liked videos fetched successfully!")
    )
})

export { toggleVideoLike,
         toggleCommentLike,
         toggleTweetLike,
         getLikedVideos} ;