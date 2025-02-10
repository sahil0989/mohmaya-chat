import express from "express";
import { Server } from "socket.io";
import http from "http"
import User from "../models/usersModel.js";
import { Conversation, Message } from "../models/conversationModel.js"
import { getConversationUser } from "../helper/getConversation.js"
import mongoose from "mongoose";

const app = express()

// socket connection 
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
})

//online Users
const onlineUser = new Set()

io.on('connection', async (socket) => {

    // console.log("Connected User: ", socket.id)

    const token = socket.handshake.auth.userId
    const user = await User.findById(token);

    if (user) {
        socket.join(user?._id?.toString());
        onlineUser.add(user?._id?.toString());
    }

    io.emit('onlineusers', Array.from(onlineUser));

    // message data
    socket.on('message-page', async (userID) => {
        const userDetails = await User.findById(userID).select("-password");

        const payload = {
            _id: userDetails?._id,
            name: userDetails?.name,
            profilePic: userDetails?.profilePic,
            emailId: userDetails?.emailId,
            online: onlineUser.has(userID)
        }

        socket.emit("message-user", payload);

        const getConversation = await Conversation.findOne({
            "$or": [
                {
                    senderId: user?._id,
                    receiverId: userID
                },
                {
                    senderId: userID,
                    receiverId: user?._id
                }
            ]
        }).populate('messages').sort({ updateAt: -1 })

        socket.emit('message', getConversation?.messages || [])
    })

    // new message
    socket.on('new message', async (data) => {

        let conversation = await Conversation.findOne({
            "$or": [
                {
                    senderId: data?.sender,
                    receiverId: data?.receiver
                },
                {
                    senderId: data?.receiver,
                    receiverId: data?.sender
                }
            ]
        })

        if (!conversation) {
            const createConversation = await Conversation({
                senderId: data?.sender,
                receiverId: data?.receiver
            })

            conversation = await createConversation.save()
        }

        const message = await Message({
            text: data?.text,
            senderId: data?.sender
        })

        const saveMessage = await message.save();

        const updateConversation = await Conversation.updateOne({ _id: conversation?._id }, {
            "$push": { messages: saveMessage?._id }
        })

        const getConversation = await Conversation.findOne({
            "$or": [
                {
                    senderId: data?.sender,
                    receiverId: data?.receiver
                },
                {
                    senderId: data?.receiver,
                    receiverId: data?.sender
                }
            ]
        }).populate('messages').sort({ updateAt: -1 })

        io.to(data?.sender).emit('message', getConversation.messages);
        io.to(data?.receiver).emit('message', getConversation.messages);

        // console.log("Get Conversation : ", getConversation || []);

        const conversationSidebarSender = await getConversationUser(data?.sender);
        const conversationSidebarReceiver = await getConversationUser(data?.receiver);

        io.to(data?.sender).emit('conversation', conversationSidebarSender);
        io.to(data?.receiver).emit('conversation', conversationSidebarReceiver);

    })

    // sidebar
    socket.on('sidebar', async (currentUser) => {

        // console.log(currentUser)
        const conversation = await getConversationUser(currentUser);

        socket.emit('conversation', conversation);

    })

    socket.on('seen', async (msgByUserId) => {
        let conversation = await Conversation.findOne({
            "$or": [
                { senderId: user?._id, receiverId: msgByUserId },
                { senderId: msgByUserId, receiverId: user?._id }
            ]
        })

        const conversationMessageId = conversation?.messages || []

        await Message.updateMany(
            { _id: { "$in": conversationMessageId }, senderId: msgByUserId },
            { "$set": { seen: true } }
        );

        const conversationSidebarSender = await getConversationUser(user?._id?.toString());

        io.to(user?._id?.toString()).emit('conversation', conversationSidebarSender);
    })

    // disconnect user
    socket.on('disconnect', () => {
        onlineUser.delete(user?._id);
        // console.log("Disconnect User: ", socket.id)
    })
})

export { app, server }