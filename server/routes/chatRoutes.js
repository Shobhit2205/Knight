import express from "express";
import { accessChatController, addToGroupController, createGroupController, fetchChatsController, getGroupDPController, removeFromGroupController, RemoveGroupDPController, renameGroupController, setGroupDPController } from "../controllers/chatController.js";
import { protect } from "../middlewares/authMiddleware.js";
import fromidable from "express-formidable";

const router = express.Router();

router.post("/access-chats", protect, accessChatController)

router.get("/fetch-chats", protect, fetchChatsController)

router.post("/create-group", protect, createGroupController)

router.put("/rename-group", protect, renameGroupController)

router.put("/add-to-group", protect, addToGroupController)

router.put("/remove-from-group", protect, removeFromGroupController)

router.put("/set-group-dp", protect, fromidable(), setGroupDPController);

router.get("/get-group-dp/:chatId", protect, getGroupDPController);

router.put("/remove-group-dp", protect, RemoveGroupDPController);


export default router;
