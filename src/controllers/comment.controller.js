import { Comment } from "../models/comment.model.js"
import { Video } from "../models/video.model.js"
import asyncHandler from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";


const getVideoComments = asyncHandler( async (req, res) => {
    
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query
    
    if(!videoId){
        throw new ApiError(400, "Something went wrong with url!")
    }
    if(isNaN(page) || page<1 || isNaN(limit) || limit<1){
        throw new ApiError(400, "Invalid pagination provided!")
    }
    
    const skip = (page-1)*limit

    const comments = await Comment.find({video : videoId})
    .skip(skip)
    .limit(limit)
    .populate("owner", "username avatar")

    const totalComments = await Comment.countDocuments({video : videoId})
    const totalPages = Math.ceil(totalComments/limit)

    if(comments.length === 0){
        throw new ApiError(400, "No comments found for this video")
    }

    return res.status(200)
    .json(
        new ApiResponse(200, {
            comments,
            pagination : {
                currentPage : page,
                totalComments,
                totalPages,
            } 
        }, "Comments fetched successfully!")
    )
})

const addComment = asyncHandler( async (req, res) => {

    const { content } = req.body
    const { videoId } = req.params

    if(!videoId){
        throw new ApiError(404, "Something went wrong with url!")
    }
    const video = await Video.findById(videoId)

    if(!content){
        throw new ApiError(401, "Content not found!")
    }
    if(!video){
        throw new ApiError(401, "No video found with this videoId!")
    }
    if(!(req.user)){
        throw new ApiError(401, "Please login to comment!")
    }
    
    const newComment = await Comment.create({
        content : content,
        video : video,
        owner : req.user._id,
    })
    //no need to add this error check as create automatically throw error if document does'nt created
    // if(!newComment){
    //     throw new ApiError(401, "Something wrong with the database!")
    // }

    return res.status(201)
    .json(
        new ApiResponse(201, newComment, "Comment added to video successfully")
    )
})

const updateComment = asyncHandler( async (req, res) => {
    
    const { commentId } = req.params
    const { newContent } = req.body
    if(!commentId){
        throw new ApiError(404, "Something went wrong with url!")
    }

    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(400, "No comment found with this commentId!")
    }
    if(!newContent){
        throw new ApiError(400, "Content not found!")
    }
    if(!(req.user._id)){
        throw new ApiError(404, "Please login to update comment!")
    }
    if(comment.owner !== req.user._id){
        throw new ApiError(404, "You are not owner of this comment!")
    }
    
    comment.content = newContent
    await comment.save()
    

    return res.status(200)
    .json(
        new ApiResponse(200, comment, "Comment updated to video successfully")
    )

})

const deleteComment = asyncHandler( async (req, res) => {
        
        const { commentId } = req.params
        if(!commentId){
            throw new ApiError(400, "Something went wrong with url!")
        }

        const comment = await Comment.findById(commentId)
        if(comment.owner !== req.user._id){
            throw new ApiError(404, "You are not owner of this comment!")
        }

        await Comment.deleteOne()

        return res.status(200)
        .json(
            new ApiResponse(200, "Comment deleted successfully!")
        )
})



export {getVideoComments,
        addComment,
        updateComment,
        deleteComment};