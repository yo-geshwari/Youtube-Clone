import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {Video} from "../models/video.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    //Validate user logged in
    //Validate request body
    //Get user id from req.user
    //Check if playlist with same name exists for user
    //Create new playlist
    //Return success response
    
    if (!name || !description) {
        throw new ApiError(400, "Name and description are required")
    }
    const userId = req.user._id
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }
    const existingPlaylist = await Playlist.findOne({name, owner: userId})
    if (existingPlaylist) {
        throw new ApiError(400, "Playlist with this name already exists")
    }
    const newPlaylist = await Playlist.create({
        name,
        description,
        owner: userId
    })
    if (!newPlaylist) {
        throw new ApiError(500, "Failed to create playlist")
    }
    res.status(201).json(new ApiResponse("Playlist created successfully", newPlaylist))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    //Validate userId
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }
    const playlists = await Playlist.find({owner: userId}).populate("videos")
    if (!playlists || playlists.length === 0) {
        throw new ApiError(404, "No playlists found for this user")
    }
    res.status(200).json(new ApiResponse(200, playlists, "User playlists retrieved successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }
    const playlist = await Playlist.findById(playlistId).populate("videos")
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    res.status(200).json(new ApiResponse(200, playlist, "Playlist retrieved successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    //validate playlistId and videoId
    //validate user logged in
    // check if playlist exists
    // check if video exists
    // add video to playlist
    // return success response

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist or video ID")
    }
    const userId = req.user._id
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    if (playlist.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You do not have permission to modify this playlist")
    }
    const video = await Video.findById(videoId)
    if (!video) {  
        throw new ApiError(404, "Video not found")
    }
    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already exists in the playlist")
    }
    playlist.videos.push(videoId)
    await playlist.save()
    res.status(200).json(new ApiResponse("Video added to playlist successfully", playlist))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist or video ID")
    }
    const userId = req.user._id
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    if (playlist.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You do not have permission to modify this playlist")
    }
    const videoIndex = playlist.videos.indexOf(videoId)
    if (videoIndex === -1) {
        throw new ApiError(404, "Video not found in the playlist")
    }
    playlist.videos.splice(videoIndex, 1)
    await playlist.save()
    res.status(200).json(new ApiResponse(200, playlist, "Video removed from playlist successfully"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }
    const userId = req.user._id
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    if (playlist.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You do not have permission to delete this playlist")
    }
    await Playlist.findByIdAndDelete(playlistId)
    res.status(200).json(new ApiResponse(200,"Playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }
    const userId = req.user._id
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    if (playlist.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You do not have permission to update this playlist")
    }
    if (name) {
        playlist.name = name
    }
    if (description) {
        playlist.description = description
    }
    const updatedPlaylist = await playlist.save()
    res.status(200).json(new ApiResponse(200, updatedPlaylist, "Playlist updated successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}