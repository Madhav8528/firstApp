import mongoose, {Schema} from "mongoose";


const likesSchema = new Schema({

    comment : {
        type : Schema.Types.ObjectId,
        ref : "Comment"
    },
    video : {
        type : Schema.Types.ObjectId,
        ref : "Video"
    },
    likedBy : {
        type : Schema.Types.ObjectId,
        ref : "User",
        require : true
    },
    tweet : {
        type : Schema.Types.ObjectId,
        ref : "Tweet"
    }

},{timestamps : true})

export const Like = mongoose.model("Like", likesSchema)