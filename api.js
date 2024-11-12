// express
import express from "express"
const app = express()
const port = 4000;

// body parser
import bodyParser from "body-parser";

// mongoose
import mongoose from "mongoose";

// middlewares
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Connect mongoose
// connection String
const conn = mongoose.connect("mongodb://localhost:27017/customBlogDB");

// Import mongoose model
import Post from "./models/Post.js"

// Inserting dummy data
/* 
Post.create({
    postId:1,
    title: "The Rise of Decentralized Finance",
    content:
      "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
    author: "Alex Thompson",
    date: "2023-08-01T10:00:00Z"
})
*/

// ENDPOINTS -- will be everything after ${api_url}/endpoint -- in index.js

// Get all blogs from db and send to index.js
app.get("/posts", async (req, res) => {
    const allPosts = await Post.find({});
    // console.log(allPosts);
    
    res.json(allPosts);
})

// Get details of specific blog from db and send to index.js
app.get("/posts/:id", async (req, res) => {
    const userChosenID = parseInt(req.params["id"]);
    const specificPost = await Post.findOne({ postId: userChosenID });
    // console.log(specificPost);

    // Send each field separatley to avoid circular json error
    res.json({
        postId: specificPost["postId"],
        title: specificPost["title"],
        content: specificPost["content"],
        author: specificPost["author"],
        date: specificPost["date"]
    });
})

// Submit a new post -- add new document to db
app.post("/posts" , async (req,res)=>{
    // console.log(req.body)

    // get latest record -- array
    const latestRecord = await Post.find().sort({ $natural: -1 })
    console.log(latestRecord[0]);
    
    // Get data from index.js which it got from index.ejs using bodyParser
    const newPost = {
        postId: latestRecord[0].postId+1,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        date: new Date()
    }

    const newPostCreation = await Post.create(newPost);
    // console.log(newPostCreation);
    res.json(newPost);
})

// Update existing post -- update document in db
app.patch("/posts/:id" , async (req,res)=>{
    const userChosenID = parseInt(req.params["id"]);
    const existingPost = await Post.findOne({ postId: userChosenID });

    const  updatedPost = await Post.updateOne({ postId: userChosenID }, {
        $set: {
            postId: userChosenID,
            title: req.body.title || existingPost.title,
            content: req.body.content || existingPost.content,
            author: req.body.author || existingPost.author,
            date: new Date()
        }
    })

    res.json(updatedPost);
})

// Delete specified post -- delete document in db
app.delete("/posts/:id",async (req,res)=>{
    const userChosenID = parseInt(req.params["id"]);
    const deletedPost = await Post.deleteOne({ postId: userChosenID });
    // console.log(deletedPost);
    res.json(deletedPost);
})


app.listen(port, () => {
    console.log(`API Server listening on port ${port}`);
})