import { Request, Response } from 'express';
import { IUser } from '../interfaces';
import User from '../models/User';

type Data = 
| {message: string}
| IUser

const getUser = async(req: Request, res: Response<Data>) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id).select('-password');
        
        if (!user) {
            return res.status(400).json({message: "User not found"}); 
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({message: "An error has occurred"});   
    }
};

const updateUser = async(req: Request, res: Response<Data>) => {
    const { id } = req.params;
    const { currentUserId, isCurrentUserAdmin, password } = req.body;
    
    if (id === currentUserId || isCurrentUserAdmin) {
        try {
            const user = await User.findByIdAndUpdate(id, req.body, {new: true});

            if (!user) {
                return res.status(400).json({message: "User not found"}); 
            }

            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({message: "An error has occurred"}); 
        }
    } else {
        return res.status(403).json({message: "Access denied. You are not the owner of this account."});
    }
}

const deleteUser = async(req: Request, res: Response<Data>) => {
    const { id } = req.params;

    const { currentUserId, isCurrentUserAdmin } = req.body;

    if (id === currentUserId || isCurrentUserAdmin) {
        try {
            await User.findByIdAndDelete(id);

            return res.status(200).json({message: "User deleted successfully."});
        } catch (error) {
            return res.status(500).json({message: "An error has occurred."});
        }
    } else {
        return res.status(403).json({message: "Access denied. You are not the owner of this account."});
    }
};

const followUser = async(req: Request, res: Response<Data>) => {
    const { id = '' } = req.params;

    const { currentUserId = '' } = req.body;

    if (currentUserId === id) {
        return res.status(403).json({message: "Action forbidden. You can't follow your own account."});
    } else {
        try {
            const followedUser = await User.findById(id);
            const followingUser = await User.findById(currentUserId);

            if (!followedUser) {
                return res.status(404).json({message: "User not found"});
            }

            if (!followingUser) {
                return res.status(404).json({message: "An error has occurred while following user."});
            }

            if (!followedUser.followers.includes(currentUserId)) {
                await followedUser.updateOne({$push: {followers: currentUserId}});
                await followingUser.updateOne({$push: {following: id}});

                return res.status(200).json({message: "User followed!"});
            } else {
                return res.status(403).json({message: "You're already following this account."});
            }
        } catch (error) {
            return res.status(500).json({message: "An error has occurred."});
        }
    }
}

const unfollowUser = async(req: Request, res: Response<Data>) => {
    const { id = '' } = req.params;

    const { currentUserId = '' } = req.body;

    if (currentUserId === id) {
        return res.status(403).json({message: "Action forbidden. You can't follow your own account."});
    } else {
        try {
            const followedUser = await User.findById(id);
            const followingUser = await User.findById(currentUserId);

            if (!followedUser) {
                return res.status(404).json({message: "User not found"});
            }

            if (!followingUser) {
                return res.status(404).json({message: "An error has occurred while following user."});
            }

            if (followedUser.followers.includes(currentUserId)) {
                await followedUser.updateOne({$pull: {followers: currentUserId}});
                await followingUser.updateOne({$pull: {following: id}});

                return res.status(200).json({message: "User unfollowed!"});
            } else {
                return res.status(403).json({message: "You're not following this account."});
            }
        } catch (error) {
            return res.status(500).json({message: "An error has occurred."});
        }
    }
}

export {
    getUser,
    updateUser,
    deleteUser,
    followUser,
    unfollowUser
};