import { Video } from "../models/video.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { isValidObjectId } from "mongoose";
import { cloudinaryUpload } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler( async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query



})

const publishVideo = asyncHandler( async (req, res) => {
    const { title, description} = req.body
    if([title, description].some((val)=>{return val?.trim() === ""})){
        throw new ApiError(400, "Please provide both the details")
    }

    const thumbnailPath = await req.files?.thumbnail[0]?.path
    if(!thumbnailPath){
        throw new ApiError(400, "Thumbnail local path not found")
    }
    console.log(thumbnailPath)
    const videoPath = await req.files?.videoFile[0]?.path
    if(!videoPath){
        throw new ApiError(400, "Video local path not found")
    }
    console.log(videoPath);
    
    if(!req.user){
        throw new ApiError(401, "Login to upload a video")
    }
    const uploadThumbnail = await cloudinaryUpload(thumbnailPath)
    if(!uploadThumbnail){
        throw new ApiError(404, "Something went wrong while uploading thumbnail to cloudinary")
    }

    const uploadVideo = await cloudinaryUpload(videoPath)
    if(!uploadVideo){
        throw new ApiError(404, "Something went wrong while uploading video to cloudinary")
    }

    const video = await Video.create({
        
        videoFile : uploadVideo?.url,
        title : title,
        description : description,
        thumbnail : uploadThumbnail?.url || "",
        duration : uploadVideo?.duration || "",
        owner : req.user._id
    })
    if(!video){
        throw new ApiError(404, "Something went wrong while publishing/uploading your video")
    }
    
    return res.status(200)
    .json(
        new ApiResponse(200, video, "Your video is uploaded and published successfully")
    )
})

const getVideoByID = asyncHandler( async (req, res) => {
    const { videoId } = req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "VideoId is not valid")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(400, "No video found with this videoId")
    }

    return res.status(200)
    .json(
        new ApiResponse(200, video, "Video fetched successfully")
    )
})

const updateVideo = asyncHandler( async (req, res) => {
    
    const { videoId } = req.params
    const { title, description, thumbnail } = req.body
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "VideoId is not valid")
    }
    if([title, description, thumbnail].some((val)=>{return val?.trim()===""})){
        throw new ApiError(400, "Please provide the details to update")
    }

    const thumbnailNewPath = await req.files?.thumbnail[0]?.path
    // if(!thumbnailNewPath){
    //     throw new ApiError(400, "Thumbnail local path not found")
    // }
    const uploadNewThumbnail = await cloudinaryUpload(thumbnailNewPath)
    // if(!uploadNewThumbnail){
    //     throw new ApiError(400, "Something went wrong while uploading new thumbnail to cloudinary")
    // }

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            title,
            description,
            thumbnail : uploadNewThumbnail?.url
        },
        {
            new : true,
        })
    
    if(!video){
        throw new ApiError(400, "Video cannot be updated")
    }

    return res.status(200)
    .json(
        new ApiResponse(200, video, "Fields updated successfully")
    )
})

const deleteVideo = asyncHandler( async (req,res) => {
    
    const { videoId } = req.params
    if(!videoId){
        throw new ApiError(400, "Something went wrong with url!")
    }
    if(!req.user){
        throw new ApiError(401, "PLease login to delete the video")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(400, "No video found with this videoId")
    }

    if(video.owner.equals(req.user._id)){
        await video.deleteOne()
    }
    else{
        throw new ApiError(403, "You are not authorize to delete this video")
    }

    return res.status(200)
    .json(
        new ApiResponse(200, "Video deleted successfully")
    )
})

const togglePublishStatus = asyncHandler( async (req, res) => {
    
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Not a valid video object Id")
    }

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(400, "No video found with this Id")
    }

    if(video.isPublished){
        video.isPublished = false;
    }
    else{
    video.isPublished = true;
    }
    await video.save()

    return res.status(200)
    .json(
        new ApiResponse(200, {isPublished : video.isPublished}, `Video is ${video.isPublished ? "Published" : "Unpublished"}`)
    )
})


export { getAllVideos,
         publishVideo,
         getVideoByID,
         updateVideo,
         deleteVideo,
         togglePublishStatus }