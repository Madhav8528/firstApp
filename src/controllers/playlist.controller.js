import { Playlist } from "../models/playlist.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { isValidObjectId } from "mongoose";

const createPlaylist = asyncHandler( async (req, res) => {
    
    const { name, description } = req.body
    if(!name){
        throw new ApiError(400, "Please provide name to create playlist")
    }
    if(!description){
        throw new ApiError(400, "Please provide description to create playlist")
    }

    if(!req.user){
        throw new ApiError(401, "Please login/signup to create playlist")
    }

    const playlist = await Playlist.create({
        name : name,
        description : description,
        owner : req.user?._id,
    })

    if(!playlist){
        throw new ApiError(400, "Something went wrong while creating playlist")
    }

    return res.status(200)
    .json( new ApiResponse(200, playlist, "Playlist created successfully"))
})

const getUserPlaylist = asyncHandler( async (req, res) => {
    
    const { userId } = req.params
    if(!userId){
        throw new ApiError(401, "Something went wrong with url")
    }

    const userPlaylist = await Playlist.find({
        owner : userId
    })
    if(!userPlaylist){
        throw new ApiError(400, "Unable to get user playlist(s)")
    }

    return res.status(200)
    .json( new ApiResponse(200, userPlaylist, "User playlist fetched successfully"))
})

const getPlaylistById = asyncHandler( async (req, res) => {
    
    const { playlistId } = req.params
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "PlaylistId is not valid")
    }

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(401, "No playlist is found with this playlistId")
    }

    return res.status(200)
    .json( new ApiResponse(200, playlist, "Playlist fetched successfully"))
})

const addVideoToPlaylist = asyncHandler( async(req, res) => {

    const { playlistId, videoId } = req.params
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400, "Please provide correct id")
    }
    if(!req.user){
        throw new ApiError(402, "Kindly login to add video to playlist")
    }

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(401, "Something went wrong while finding playlist")
    }

    const playlistOwner = playlist.owner.toString()
    const currentUser = req.user?._id.toString()
    if(playlistOwner !== currentUser){
        throw new ApiError(401, "You are not authorize to add videos to this playlist")
    }

    playlist.videos.push(videoId)
    await playlist.save()

    return res.status(200)
    .json(new ApiResponse(200, playlist, "Video is successfully added to the playlist"))
})

const removeVideoFromPlaylist = asyncHandler( async (req, res) => {
    
    const { playlistId, videoId } = req.params
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400, "Please provide correct id")
    }
    if(!req.user){
        throw new ApiError(402, "Kindly login to add video to playlist")
    }

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(401, "Something went wrong while finding playlist")
    }

    const playlistOwner = playlist.owner.toString()
    const currentUser = req.user?._id.toString()
    if(playlistOwner !== currentUser){
        throw new ApiError(401, "You are not authorize to add videos to this playlist")
    }

    playlist.videos.filter((val) => { val !== videoId})
    await playlist.save()

    return res.status(200)
    .json(
        new ApiResponse(200, playlist, "Video is removed successfully!")
    )
})

const updatePlaylist = asyncHandler( async (req, res) => {
    
    const { playlistId } = req.params
    const { name, description } = req.body
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "PlaylistId is not valid")
    }
    if([name, description].some((val)=>{ return val?.trim() === ""})){
        throw new ApiError(401, "Please provide the details to update the playlist")
    }
    if(!req.user){
        throw new ApiError(402, "Please login to update playlist")
    }
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(402, "No playlist found with this playlistId")
    }

    const playlistOwner = playlist.owner.toString()
    const currentUser = req.user?._id.toString()
    if(playlistOwner !== currentUser){
        throw new ApiError(401, "You are not authorize to add videos to this playlist")
    }

    playlist.name = name
    playlist.description = description
    await playlist.save()

    return res.status(200)
    .json(200, playlist, "Playlist is updated successfully")
})

const deletePlaylist = asyncHandler( async (req, res) => {
    
    const{ playlistId } = req.params
    if(!isValidObjectId(playlistId)){
        throw new ApiError(401, "Please provide a valid playlistId")
    }
    if(!req.user){
        throw new ApiError(400, "Please login to delete the playlist")
    }

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(400, "No playlist found with this playlistId")
    }

    const playlistOwner = playlist.owner.toString()
    const currentUser = req.user?._id.toString()
    if(playlistOwner !== currentUser){
        throw new ApiError(401, "You are not authorize to add videos to this playlist")
    }

    await playlist.deleteOne()

    return res.status(200)
    .json(200, "Playlist deleted successfully!")
})

export { createPlaylist,
         getUserPlaylist,
         getPlaylistById,
         addVideoToPlaylist,
         removeVideoFromPlaylist,
         updatePlaylist,
         deletePlaylist};