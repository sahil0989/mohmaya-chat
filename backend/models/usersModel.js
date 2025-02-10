import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true
    },
    profilePic: {
        type: String,
    },
    bio: {
        type: String,
        default: ""
    },
    conversation: {
        type: [String],
        default: [],
    }
}, {
    timestamps: true,
})

const User = mongoose.model("User", userSchema);

export default User;