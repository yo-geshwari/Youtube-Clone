import mongoose, {Schema} from "mongoose";

const likeSchema = new Schema(
    {
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video",
            required: false
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
            required: false // Optional, can be null if the like is for a video
        },
        tweet: {
            type: Schema.Types.ObjectId,
            ref: "Tweet",
            required: false // Optional, can be null if the like is for a video or comment
        },
        likedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Like = mongoose.model("Like", likeSchema);