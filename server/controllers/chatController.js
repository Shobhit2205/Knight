import chatModel from "../models/chatModel.js";
import userModel from "../models/userModel.js";
import fs from "fs";

export const accessChatController = async (req, res) => {
    try{
        const {userId} = req.body;

        if(!userId){
            return res.status(400).send({
                status: "error",
                message: "User id not received"
            })
        }

        var isChat = await chatModel.find({
            isGroupChat: false,
            $and: [
                {users : {$elemMatch: {$eq: req.user._id}}},
                {users : {$elemMatch: {$eq: userId}}},
            ]
        }).populate("users", "-password").populate("latestMessage");

        isChat = await userModel.populate(isChat, {
            path: "latestMessage.sender",
            select: "firstName lastName email"
        })

        if(isChat.length > 0){
            return res.status(200).send({chat : isChat[0]});
        }
        else{
            var chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId]
            }

            try {
                const createdChat = await chatModel.create(chatData);

                const fullChat = await chatModel.findOne({_id: createdChat._id}).populate("users", "-password");

                res.status(200).send({chat : fullChat});
            } catch (error) {
                return res.status(400).send({
                    status: "error",
                    message: "Can not create chat with user",
                    error,
                })
            }
        }
    }
    catch(error){
        res.status(400).send({
            status: "error",
            message: "something went wrong in accessing chat",
            error,
        })
    }
}

export const fetchChatsController = async (req, res) => {
    try {
        var chats = await chatModel.find({users: {$elemMatch: {$eq: req.user._id}}}).populate("users", "-password").populate("groupAdmin", "-password").populate("latestMessage").sort({updatedAt: -1});

        chats = await userModel.populate(chats, {
            path: "latestMessage.sender",
            select: "firstName lastName email"
        })

        res.status(200).send(chats);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "error",
            message: "Something went wrong in fetching chats",
            error,
        })
    }
}

export const createGroupController = async (req, res) => {
    try {
        if(!req.body.name){
            return res.status(400).send({
                status: "error",
                message: "Group name is required"
            })
        }
        if(!req.body.users){
            return res.status(400).send({
                status: "error",
                message: "Users are is required"
            })
        }

        const users = JSON.parse(req.body.users);
        if(users.length < 2){
            return res.status(400).send({
                status: "error",
                message: "Users should be greater than 1"
            })
        }

        users.push(req.user);

        const groupChat = await chatModel.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        })

        const fullgroupchat = await chatModel.findOne({_id: groupChat._id}).populate("users", "-password").populate("groupAdmin", "-password");

        res.status(200).send({
            status: "success",
            message: "Group chat Created",
            groupChat : fullgroupchat
        })
        
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "error",
            message: "something went wrong in creating group",
            error
        })
    }

}

export const renameGroupController = async (req, res) => {
    try {
        const {chatId, chatName} = req.body;

        const updatedChat = await chatModel.findByIdAndUpdate(chatId, {chatName}, {new: true}).populate("users", "-password").populate("groupAdmin", "-password");

        if(!updatedChat){
            return res.status(400).send({
                status: "error",
                message: "Not updated"
            })
        }

        res.status(200).send({
            status: "success",
            message: `Renamed the group to ${chatName}`,
            group: updatedChat
        })

    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "error",
            message: "something went wrong in renaming group",
            error
        })
    }
}

export const addToGroupController = async (req, res) => {
    try {
        const {chatId} = req.body;
        const newusers = JSON.parse(req.body.users);

        const added = await chatModel.findByIdAndUpdate(chatId, {$push: {users: {$each: newusers}}}, {new: true}).populate("users", "-password").populate("groupAdmin", "-password");

        if(!added){
            return res.status(400).send({
                status: "error",
                message: "User not added to Group"
            })
        }

        res.status(200).send({
            status: "success",
            message: `User added to the group`,
            group: added
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "error",
            message: "something went wrong in adding user",
            error
        })
    }
}

export const removeFromGroupController = async (req, res) => {
    try {
        const {chatId, userId} = req.body;

        const removed = await chatModel.findByIdAndUpdate(chatId, {$pull: {users: userId}}, {new: true}).populate("users", "-password").populate("groupAdmin", "-password");

        if(!removed){
            return res.status(400).send({
                status: "error",
                message: "User is not Removed from the Group"
            })
        }

        res.status(200).send({
            status: "success",
            message: `User Removed from the group`,
            group: removed
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "error",
            message: "something went wrong in Removing user",
            error
        })
    }
}

export const setGroupDPController = async (req, res) => {
    try {
        const {chatId} = req.fields;
        const {groupDP} = req.files;

        if(!groupDP){
            return res.status(400).send("Please upload the valid picture")
        }

        const group = await chatModel.findById(chatId);

        if(groupDP){
            group.groupDP.data = fs.readFileSync(groupDP.path);
            group.groupDP.contentType = groupDP.type;
        }

        await group.save();
        res.status(200).send({
            status: "success",
            message: "Picture updated successfully",
            group
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "error",
            message: "Picture not updated",
            error,
        })
    }
}


export const getGroupDPController = async (req, res) => {
    try {
        const {chatId} = req.params;

        const group = await chatModel.findById(chatId).select("groupDP");

        if (group.groupDP.data) {
            res.set("Content-type", group.groupDP.contentType);
            res.status(200).send(group.groupDP.data);
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "error",
            message: "can not get picture",
            error,
        })
    }
}

export const RemoveGroupDPController = async (req, res) => {
    try {
        const {chatId} = req.body;
        console.log(chatId);
        const chat = await chatModel.findById(chatId);
        chat.groupDP = undefined;
        await chat.save();
        res.send({
            status: "success",
            message: "Picture removed successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "error",
            message: "Picture not removed",
            error,
        })
    }
}