import mongoose from "mongoose";
import Post from "../models/Post.js";
import User from "../models/User.js";


const createPost = async(req, res) => {
    const newPost = new Post(req.body);
    
    try {
        await newPost.save();
        return res.status(200).json({message: "Post created succesfully."});
    } catch (error) {
        return res.status(500).json({message: "An error has occurred."});
    }
};

const getPost = async(req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({message: "An error has occurred."});
    }
};

const updatePost = async(req, res) => {
    const { id: postId } = req.params; 
    const { userId } = req.body;

    try {
        const post = await Post.findById(postId);
        if (post.userId === userId) {
            await post.updateOne({$set: req.body});
            return res.status(200).json({message: "Post updated succesfully."});
        } else {
            return res.status(403).json({message: "Unauthorized. You're not the owner of the post."});
        }
    } catch (error) {
        return res.status(500).json({message: "An error has occurred."});
    }
};

const deletePost = async(req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    try {
        const post = await Post.findById(id);
        if (post.userId === userId) {
            await post.delete();
            return res.status(200).json({message: "Post deleted succesfully."});
        } else {
            return res.status(403).json({message: "Unauthorized. You're not the owner of the post."});
        }
    } catch (error) {
        return res.status(500).json({message: "An error has occurred."});
    }
};

const likePost = async(req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    try {
        const post = await Post.findById(id);
        if (!post.likes.includes(userId)) {
            await post.updateOne({$push: {likes: userId}});
            return res.status(200).json({message: "Post liked."});
        } else {
            await post.updateOne({$pull: {likes: userId}});
            return res.status(200).json({message: "Post unliked."});
        }
    } catch (error) {
        return res.status(500).json({message: "An error has occurred."});
    }
};

const getTimelinePosts = async(req, res) => {
    const { id: userId } = req.params; 

    try {
        const currentUserPosts = await Post.find({userId});
        const followingUserPosts = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'posts',
                    localField: 'following',
                    foreignField: 'userId',
                    as: 'followingPosts'
                }
            }, 
            {
                $project: {
                    followingPosts: 1,
                    _id: 0
                }
            }
        ]);

        return res.status(200).
            json(currentUserPosts.
            concat(...followingUserPosts[0].followingPosts).
            sort((a, b) => {
                return b.createdAt - a.createdAt
            })
        );

    } catch (error) {
        return res.status(500).json({message: "An error has occurred."});
    }
};

export {
    createPost,
    getPost,
    updatePost,
    deletePost,
    likePost,
    getTimelinePosts
};