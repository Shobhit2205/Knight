import userModel from "../models/userModel.js"
import fs from "fs";

export const userSearchController = async (req, res) => {
    const keyword = req.query.search ? {
        $or : [
            {firstName: {$regex: req.query.search, $options: "i"}},
            {lastName: {$regex: req.query.search, $options: "i"}},
            {email: {$regex: req.query.search, $options: "i"}},
        ]
    } : {}

    const users = await userModel.find(keyword).find({_id : {$ne: req.user._id}}).select("-password");

    res.status(200).send(users);
}



export const updateUserInfoController = async (req, res) => {
    try {
        const {firstName, lastName} = req.body;
        await userModel.findByIdAndUpdate(req.user._id, {firstName, lastName})
        const user = await userModel.findById(req.user._id);
        res.status(200).send({
            status: "success",
            message: "User Updated successfully",
            user,
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "error",
            message: "can not get UserInfo",
            error,
        })
    }
}

export const uploadPictureController = async (req, res) => {
    try {
        const {picture} = req.files;

        if(!picture){
            return res.status(400).send("Please upload the valid picture")
        }

        const user = await userModel.findById(req.user._id).select("-password");

        if(picture){
            user.picture.data = fs.readFileSync(picture.path);
            user.picture.contentType = picture.type;
        }

        await user.save();

        res.status(200).send({
            status: "success",
            message: "Picture updated successfully",
            user
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

export const getUserPictureController = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        
        if (user.picture.data) {
            res.set("Content-type", user.picture.contentType);
            res.status(200).send(user.picture.data);
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

export const RemovePictureController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        user.picture = undefined;
        await user.save();
        console.log(user);
        // const pic = await userModel.findByIdAndUpdate(req.user._id, {picture : ""});

        res.status(200).send({
            status: "success",
            message: "Profile removed successfully"
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