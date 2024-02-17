import chatModel from "../models/chatModel.js";
import messageModel from "../models/messageModel.js";
import userModel from "../models/userModel.js";

export const sendMessageController = async (req, res) => {
    try {
        const {content, chatId} = req.body;

        if(!content || !chatId){
            return res.status(400).send({
                status: "error",
                message: "Invalid Message",
            })
        }

        const newMessage = {
            sender: req.user._id,
            chat: chatId,
            content: content,
        }

        var message = await messageModel.create(newMessage);

        message = await message.populate("sender", "firstName lastName")
        message = await message.populate("chat")
        message = await userModel.populate(message, {
            path: "chat.users",
            select: "firstName lastName email"
        });

        await chatModel.findByIdAndUpdate(chatId, {latestMessage: message});

        res.json(message);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "error",
            message: "Error in sending Message!"
        })
    }
}

export const allMessagesController = async (req, res) => {
    try {
        const messages = await messageModel.find({chat: req.params.chatId}).populate("sender", "firstName lastName email").populate("chat");

        res.status(200).send({
            status: "success",
            message: "All Messages",
            messages,
        })

    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "error",
            message: "Error in getting Messages"
        })
    }
}