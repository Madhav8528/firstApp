import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { isValidObjectId } from "mongoose";

const getChannelStats = asyncHandler( async (req, res) => {
    
    const { channel } = req.params
    if(!isValidObjectId(channel)){
        throw new ApiError(400, "Something went wrong with the url")
    }

    const subscriber = await Subscription.findById(channel)
    //console.log(subscriber)
    const subscriberCount = subscriber.length()
    if(!subscriber || subscriberCount === 0){
        throw new ApiError(401, "No subscriber found with this Id")
    }

    const user = await User.findById(channel)
    if(!user){
        throw new ApiError(400, "No channel found with this user")
    }

    const video = await Video.find({ owner : channel}).select("views")
    const videoCount = video.length()
    const viewsCount = video.reduce((count, obj) => {
        count += obj.views
        return count
    }, 0)
    if(!video){
        throw new ApiError(400, "No videos found of this channel")
    }
    
    return res.status(200)
    .json( new ApiResponse(200,
         [ user, subscriberCount, videoCount, videoCount], "ChannelStats fetched successfully!"))
})

const getChannelVideos = asyncHandler( async (req, res) => {
    
    const { channel } = req.params
    if(!isValidObjectId(channel)){
        throw new ApiError(400, "Something went wrong with the url")
    }

    const video = await Video.find({ owner : channel })
    if(!video){
        throw new ApiError(400, "No videos found for this channel")
    }

    return res.status(200)
    .json( new ApiResponse(200, video, "Videos fetched successfully!"))
})

export { getChannelStats,
         getChannelVideos };