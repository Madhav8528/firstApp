import mongoose,{Schema} from "mongoose"

const playlistSchema = new Schema({
    name : {
        type : String,
        require : true,
        trim : true,
    },
    description : {
        type : String,
        require : true,
    },
    videos : [{
        type : Schema.Types.ObjectId,
        ref : "Video"
    }],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
}, {
    timestamps : true
})

export const playList = mongoose.model("playList", playlistSchema)