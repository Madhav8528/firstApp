import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";

const createTweet = asyncHandler( async (req, res) => {
    
    const { content } = req.body
    if(!content){
        throw new ApiError(400, "Please provide content for tweet")
    }

    if(!req.user){
        throw new ApiError(401, "Please login to write tweet!")
    }

    const tweet = await Tweet.create(
        {
            content : content,
            owner : req.user?._id
        }
    )
    if(!tweet){
        throw new ApiError(404, "Something went wrong while creating tweet")
    }

    return res.status(200)
    .json( new ApiResponse(200, tweet, "Tweet done successfully!"))
})

const updateTweet = asyncHandler( async (req, res) => {
    
    const { newContent } = req.body
    const { tweetId } = req.params

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "TweetId is not valid")
    }
    if(!newContent){
        throw new ApiError(400, "Please provide content for updation")
    }
    if(!req.user){
        throw new ApiError(401, "Please login to update the tweet")
    }

    const tweet = await Tweet.findById(tweetId)

    const tweetOwner = tweet.owner.toString()
    const currentUser = req.user._id.toString()
     console.log(tweetOwner)
     console.log(currentUser)
    if(tweetOwner !== currentUser){
        throw new ApiError(402, "You are not authorize to update this tweet")
    }

    tweet.content = newContent
    await tweet.save()

    return res.status(200)
    .json(
        new ApiResponse(200, tweet, "Tweet Updated successfully!")
    )
})

const deleteTweet = asyncHandler( async (req, res) => {
    
    const { tweetId } = req.params
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "TweetId is not valid")
    }

    if(!req.user){
        throw new ApiError(401, "Please login to delete the tweet")
    }

    const tweet = await Tweet.findById(tweetId)

    const tweetOwner = tweet.owner.toString()
    const existingUser = req.user._id.toString()
    if(tweetOwner !== existingUser){
        throw new ApiError(402, "You are not authorize to delete this tweet")
    }
    
    await tweet.deleteOne()

    return res.status(200)
    .json( new ApiResponse(200, "Tweet is deleted successfully!"))
})

const getUserTweets = asyncHandler( async (req, res) => {
    
    const { userId } = req.params
    if(!userId){
        throw new ApiError(400, "UserId is not valid")
    }

    const tweets = await Tweet.find({
        owner : userId
    }).select("content _id")
    //console.log(tweets);
    
    if(!tweets){
        throw new ApiError(400, "Something went wrong while fetching comment")
    }

    return res.status(200)
    .json(200, tweets, "Tweets fetched successfully")
})


export { createTweet,
         updateTweet,
         deleteTweet,
         getUserTweets};