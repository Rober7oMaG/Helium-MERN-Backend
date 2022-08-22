import { Request, Response } from 'express';
import mongoose from "mongoose";
import { IFollowingPosts, IPost } from '../interfaces';
import Post from "../models/Post";
import User from "../models/User";

type Data = 
| { message: string}
| IPost
| IPost[]
| []

const createPost = async(req: Request, res: Response<Data>) => {
    const newPost = new Post(req.body);
    
    try {
        await newPost.save();
        return res.status(200).json({message: "Post created succesfully."});
    } catch (error) {
        return res.status(500).json({message: "An error has occurred."});
    }
};

const getPost = async(req: Request, res: Response<Data>) => {
    const { id } = req.params;
    
    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({message: "Post not found."});
        }

        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({message: "An error has occurred."});
    }
};

const updatePost = async(req: Request, res: Response<Data>) => {
    const { id: postId } = req.params; 
    const { userId } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({message: "Post not found."});
        }

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

const deletePost = async(req: Request, res: Response<Data>) => {
    const { id } = req.params;
    const { userId } = req.body;

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({message: "Post not found."});
        }

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

const likePost = async(req: Request, res: Response<Data>) => {
    const { id } = req.params;
    const { userId } = req.body;

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({message: "Post not found."});
        }

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

const getTimelinePosts = async(req: Request, res: Response<Data>) => {
    const { id: userId } = req.params; 

    try {
        const currentUserPosts: IPost[] = await Post.find({userId});
        const followingUserPosts: IFollowingPosts[] = await User.aggregate([
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