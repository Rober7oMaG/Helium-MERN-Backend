import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from "../models/User";

const registerUser = async(req: Request, res: Response) => {
    const { username, password, firstName, lastName } = req.body;

    const newUser = new User({username, password, firstName, lastName});

    try {
        await newUser.save();
        res.status(200).json(newUser);
    } catch (error) {
        res.status(500).json({message: "An error has occurred."});
    }
};

const loginUser = async(req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = await User.findOne({username});

    if (!user) {
        return res.status(400).json({ message: 'Incorrect credentials. - USERNAME' });
    }

    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ message: 'Incorrect credentials. - PASSWORD' });
    }

    return res.status(200).json({message: 'OK'});
}

export {
    registerUser,
    loginUser
};
