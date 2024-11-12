import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    postId : {
        type:Number,
        required:true,
        unique:[true,"PostId already exists"]
    },
    title : {
        type: String,
        required: [true,"Title missing"]
    },
    content : {
        type: String,
        required: [true,"Content missing"]
    } , 
    author : {
        type: String,
        required: [true,"Author missing"]
    },
    date : Date
})

const Post = mongoose.model("Post",PostSchema);
export default Post;