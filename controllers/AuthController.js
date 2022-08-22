import User from "../models/User.js";
import bcrypt from 'bcrypt';

const registerUser = async(req, res) => {
    const { username, password, firstName, lastName } = req.body;

    const newUser = User({username, password, firstName, lastName});

    try {
        await newUser.save();
        res.status(200).json(newUser);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const loginUser = async(req, res) => {
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
