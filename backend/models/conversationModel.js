import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    senderId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }, 
    seen: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const conversationSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    messages: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Message"
        }
    ]
}, {
    timestamps: true
})

const Conversation = mongoose.model("Conversation", conversationSchema);
const Message = mongoose.model("Message", messageSchema);

export { Conversation, Message };