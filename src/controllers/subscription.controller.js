import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    // Validate channelId
    // Validate user logged in
    // Check if user is already subscribed to the channel
    // If subscribed, unsubscribe the user from the channel
    // If not subscribed, subscribe the user to the channel

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID")
    }
    const userId = req.user._id
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }
    const channel = await User.findById(channelId)
    if (!channel) {
        throw new ApiError(404, "Channel not found")
    }
    const subscription = await Subscription.findOne({ subscriber: userId, channel: channelId })
    if (subscription) {
        // User is already subscribed, so unsubscribe
        await Subscription.deleteOne({ subscriber: userId, channel: channelId })
        return res.status(200).json(new ApiResponse(200, "Unsubscribed successfully"))
    } else {
        // User is not subscribed, so subscribe
        const newSubscription = new Subscription({
            subscriber: userId,
            channel: channelId
        })
        await newSubscription.save()
        return res.status(201).json(new ApiResponse(201, "Subscribed successfully"))
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // Validate channelId
    // Validate user logged in
    // Validate if user is the owner of the channel
    // Check if channel exists
    // If exists, return the list of subscribers

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID")
    }
    const channel = await User.findById(channelId)
    if (!channel) {
        throw new ApiError(404, "Channel not found")
    }

    if (channel._id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to view subscribers of this channel")
    }
    const subscribers = await Subscription.find({ channel: channelId })
        .populate('subscriber', 'username avatar')
        .select('subscriber createdAt')
    
    if (subscribers.length === 0) {
        return res.status(200).json(new ApiResponse(200, "No subscribers found for this channel"))
    }
    return res.status(200).json(new ApiResponse(200, subscribers, "Subscribers retrieved successfully"))    
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    // Validate subscriberId
    // Validate user logged in
    // Check if subscriber exists
    // If exists, return the list of channels to which user has subscribed
    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID")
    }
    const subscriber = await User.findById(subscriberId)
    if (!subscriber) {
        throw new ApiError(404, "Subscriber not found")
    }
    if (subscriber._id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to view subscribed channels of this user")
    }
    const subscriptions = await Subscription.find({ subscriber: subscriberId })
        .populate('channel', 'name profileImage')
        .select('channel createdAt')
    
    if (subscriptions.length === 0) {
        return res.status(200).json(new ApiResponse(200, "No subscribed channels found for this user"))
    }
    return res.status(200).json(new ApiResponse(200, subscriptions, "Subscribed channels retrieved successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}