import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    profilePicture: {
        type: String
    },
    coverPicture: {
        type: String
    },
    about: {
        type: String
    },
    livesIn: {
        type: String
    },
    worksAt: {
        type: String
    },
    relationshipStatus: {
        type: String
    },
    followers: [

    ],
    following: [

    ]
}, {
    timestamps: true
});

// Hash password before saving to database
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hashSync(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;