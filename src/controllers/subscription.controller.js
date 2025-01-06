import { asyncHandler } from "../utils/asyncHandler.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js"


const toggleSubscription = asyncHandler( async (req, res) => {
    
    const { channelId } = req.params
    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "ChannelId is not valid")
    }
    if(!req.user){
        throw new ApiError(401, "Please login to proceed with subscription")
    }
    const subscription = await Subscription.findOne({
        channel : channelId
    })
    if(subscription){
        await subscription.deleteOne()
        return res.status(200)
        .json( new ApiResponse(200, "You are now unsubscribed"))
    }
    else{
        const subscribing = await Subscription.create(
            {
                subscriber : req.user._id,
                channel : channelId,
            }
        )
        if(!subscribing){
            throw new ApiError(400, "Something went wrong while subscribing")
        }

        return res.status(200)
        .json( new ApiResponse(200, subscribing, "You are now subscribed"))
    }
})

const getChannelSubscriber = asyncHandler( async (req, res) => {
    
    const { channelId } = req.params
    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "ChannelId is not valid")
    }

    const subscribers = await Subscription.find({ channel : channelId })
    if(!subscribers){
        throw new ApiError(402, "Something went wrong while getting subscriber")
    }

    return res.status(200)
    .json(
        new ApiResponse(200, subscribers, "Subscriber fetched successfully")
    )
})

const userSubscription = asyncHandler( async (req, res) => {
    
    const { subscriberId } = req.params
    if(!isValidObjectId(subscriberId)){
        throw new ApiError(401, "SubscriberId is not valid")
    }

    const channel = await Subscription.find({ subscriber : subscriberId })
    if(!channel){
        throw new ApiError(402, "Something went wrong while getting channel")
    }

    return res.status(200)
    .json(
        new ApiResponse(200, channel, "Channel fetched successfully")
    )
})


export { toggleSubscription,
         getChannelSubscriber,
         userSubscription};