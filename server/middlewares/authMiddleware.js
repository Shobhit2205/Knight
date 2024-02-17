import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";


export const protect = async (req, res, next) => {
    try {
        let token;
        if(req.headers.authorization){
            token = req.headers.authorization;

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await userModel.findById(decoded._id).select("-password"); 
            console.log(req.user);
        }
        next();
    } catch (error) {
        res.status(401).send({
            status: "error",
            message: "Invalid User, Please check your Internet connection"
        })
    }
}