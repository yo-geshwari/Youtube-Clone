import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    // dont check if user is authenticated
    // Validate pagination parameters
    // Convert page and limit to numbers
    // Validate query, sortBy, sortType, userId
    // Check if userId is provided and is a valid ObjectId
    // If userId is provided, filter videos by userId
    // If query is provided, filter videos by title or description
    // Sort videos based on sortBy and sortType
    // Paginate the results
    // Return the paginated videos
    
    const pageNumber = parseInt(page, 10)
    const pageSize = parseInt(limit, 10)
    if (isNaN(pageNumber) || pageNumber < 1) {
        throw new ApiError(400, "Invalid page number")
    }
    if (isNaN(pageSize) || pageSize < 1) {
        throw new ApiError(400, "Invalid page size")
    }
    const skip = (pageNumber - 1) * pageSize
    const filter = {}
    if (userId) {
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid user ID")
        }
        filter.owner = userId
    }
    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ]
    }
    const sort = {}
    if (sortBy) {
        if (!["createdAt", "views", "likes"].includes(sortBy)) {
            throw new ApiError(400, "Invalid sortBy field")
        }
        sort[sortBy] = sortType === "desc" ? -1 : 1
    } else {
        sort.createdAt = -1 // Default sort by createdAt descending
    }
    const videos = await Video.find(filter)
        .populate("owner", "username avatar")
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
    const totalVideos = await Video.countDocuments(filter)
    const totalPages = Math.ceil(totalVideos / pageSize)   
    return res.status(200).json(new ApiResponse(200, {
        videos,
        totalVideos,
        totalPages,
        currentPage: pageNumber
    }, "Videos retrieved successfully"))
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video

    if (!title || title.trim() === "") {
        throw new ApiError(400, "Title is required")
    }
    if (!description || description.trim() === "") {
        throw new ApiError(400, "Description is required")
    }
    const userId = req.user._id
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }
    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    // Validate video & thumbnail files
    const videoFile = req.files?.videoFile?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];
    
    if (!videoFile) throw new ApiError(400, "Video file is required");
    if (!thumbnailFile) throw new ApiError(400, "Thumbnail is required");

    // Upload video
    const videoResponse = await uploadOnCloudinary(videoFile.buffer);
    if (!videoResponse?.secure_url) throw new ApiError(500, "Video upload failed");

    // Upload thumbnail
    const thumbnailResponse = await uploadOnCloudinary(thumbnailFile.buffer);
    if (!thumbnailResponse?.secure_url) throw new ApiError(500, "Thumbnail upload failed");

    // Create a new video document
    const newVideo = new Video({
    title,
    description,
    videoFile: videoResponse.secure_url,
    owner: userId,
    thumbnail: thumbnailResponse.secure_url,
    duration: req.body.duration || 0,
    views: 0,
    isPublished: true,
  });
    await newVideo.save()
    return res.status(201).json(new ApiResponse(201, newVideo, "Video published successfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }
    const video = await Video.findById(videoId)
        .populate("owner", "username avatar")
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    // Increment views count
    video.views += 1
    await video.save()

    if (req.user && req.user._id) {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { watchHistory: videoId }, // Remove if already exists (to avoid duplicates)
      },
      { new: true }
    );
    
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { watchHistory: { $each: [videoId], $position: 0 } }, // Add to beginning of array
      }
    );
    }
    console.log(req.user.watchHistory)
    return res.status(200).json(new ApiResponse(200, video, "Video retrieved successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    const { title, description } = req.body
    if (title && title.trim() !== "") {
        video.title = title
    }
    if (description && description.trim() !== "") {
        video.description = description
    }
    // Handle thumbnail update
    if (req.files?.thumbnail?.[0]) {
        const thumbnailFile = req.files.thumbnail[0]
        const thumbnailResponse = await uploadOnCloudinary(thumbnailFile.path)
        if (!thumbnailResponse?.secure_url) {
            throw new ApiError(500, "Thumbnail upload failed")
        }
        video.thumbnail = thumbnailResponse.secure_url
    }
    await video.save()
    return res.status(200).json(new ApiResponse(200, video, "Video updated successfully"))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this video")
    }
    await video.remove()
    return res.status(200).json(new ApiResponse(200, null, "Video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to change the publish status of this video")
    }
    video.isPublished = !video.isPublished
    await video.save()
    return res.status(200).json(new ApiResponse(200, video, `Video is now ${video.isPublished ? "published" : "unpublished"}`))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}