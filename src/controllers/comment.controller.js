import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: {createdAt: -1} // Sort by creation date, newest first
    }
    const comments = await Comment.paginate({video: videoId}, options)
    if (!comments || comments.comments.length === 0) {
        return res.status(404).json(new ApiResponse(404, null, "No comments found for this video"))
    }
    return res.status(200).json(new ApiResponse(200, comments, "Comments retrieved successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {content} = req.body
    const userId = req.user._id
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }
    if (!content || content.trim() === "") {
        throw new ApiError(400, "Comment content cannot be empty")
    }
    const comment = await Comment.create({
        video: videoId,
        owner: userId,
        content: content.trim()
    })
    return res.status(201).json(new ApiResponse(201, comment, "Comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {content} = req.body
    const userId = req.user._id
    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID")
    }
    if (!content || content.trim() === "") {
        throw new ApiError(400, "Comment content cannot be empty")
    }
    const comment = await Comment.findOneAndUpdate(
        {_id: commentId, owner: userId},
        {content: content.trim()},
        {new: true, runValidators: true}
    )
    if (!comment) {
        throw new ApiError(404, "Comment not found or you do not have permission to update it")
    }
    return res.status(200).json(new ApiResponse(200, comment, "Comment updated successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params
    const userId = req.user._id
    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID")
    }
    const comment = await Comment.findOneAndDelete({_id: commentId, owner: userId})
    if (!comment) {
        throw new ApiError(404, "Comment not found or you do not have permission to delete it")
    }
    return res.status(200).json(new ApiResponse(200, null, "Comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
    }