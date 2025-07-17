import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import { Like} from "../models/like.model.js"
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose, {isValidObjectId} from "mongoose";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    //Check if videoId is a valid ObjectId
    //Check if user is authenticated
    //Get like document id from user returned by auth middleware
    //Check if like document exists for the video and user
    //If it exists, remove the like document
    //If it does not exist, create a new like document

    const userId = req.user._id

    if (!userId || !isValidObjectId(videoId)) {
        return res.status(400).json(new ApiError(400, "Invalid video ID"))
    }

    const existingLike = await Like.findOne({video: videoId, likedBy: userId})

    if( existingLike ){
        //Like exists, remove it
        await Like.findByIdAndDelete(existingLike._id)
        return res.status(202).json(new ApiResponse(202, "Like removed successfully"))
    }else{
        //Like does not exist, create a new one
        const newLike = await Like.create({
            video: videoId,
            likedBy: userId
        })
        return res.status(201).json(new ApiResponse(201, newLike, "Like added successfully"))
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if (!commentId || !isValidObjectId(commentId)) {
        return res.status(400).json(new ApiError(400, "Invalid comment ID"))
    }
    const existingLike = await Comment.findOne({comment: commentId, likedBy: userId})

    if( existingLike ){
        //Like exists, remove it
        await Comment.findByIdAndDelete(existingLike._id)
        return res.status(202).json(new ApiResponse(202, "Like removed successfully"))
    }else{
        //Like does not exist, create a new one
        const newLike = await Like.create({
            Comment: commentId,
            likedBy: userId
        })
        return res.status(201).json(new ApiResponse(201, newLike, "Like added successfully"))
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if (!tweetId || !isValidObjectId(tweetId)) {
        return res.status(400).json(new ApiError(400, "Invalid tweet ID"))
    }
    const userId = req.user._id
    const existingLike = await Like.findByIdAndDelete({tweet: tweetId, likedBy: userId})
    if( existingLike ){
        //Like exists, remove it
        await Like.findByIdAndDelete(existingLike._id)
        return res.status(202).json(new ApiResponse(202, "Like removed successfully"))
    } else {
        //Like does not exist, create a new one
        const newLike = await Like.create({
            tweet: tweetId,
            likedBy: userId
        })
        return res.status(201).json(new ApiResponse(201, newLike, "Like added successfully"))
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user._id
    const likedVideos = await Like.find({likedBy: userId})
    .populate("video", "title description thumbnail")
    .populate("likedBy", "username avatar")
    .exec()
    if (!likedVideos || likedVideos.length === 0) {
        return res.status(404).json(new ApiResponse(404, null, "No liked videos found"))
    }
    return res.status(200).json(new ApiResponse(200, likedVideos, "Liked videos retrieved successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}