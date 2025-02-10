import { Conversation } from "../models/conversationModel.js"

const getConversationUser = async (currentUser) => {

    if (currentUser) {
        const currentUserConversation = await Conversation.find({
            "$or": [
                { senderId: currentUser },
                { receiverId: currentUser }
            ]
        }).sort({ updateAt: -1 }).populate("messages").populate('senderId').populate('receiverId')

        const conversation = currentUserConversation?.map((msg) => {
            let countUnseenMsg = msg.messages.reduce((prev, curr) => {

                const msgByUserId = curr?.msgByUserId?.tostring()

                if(msgByUserId === currentUser){
                    return prev + (curr?.seen? 0: 1)
                } else {
                    return prev
                }
            }, 0)

            if(msg?.senderId === msg?.receiverId){
                countUnseenMsg = 0;
            }

            return {
                _id: msg?._id,
                senderId: msg?.senderId,
                receiverId: msg?.receiverId,
                unseenMsg: countUnseenMsg,
                lastMsg: msg.messages[msg?.messages?.length - 1]
            }
        })

        return conversation;

    } else {

        return [];
    }
}

export { getConversationUser }