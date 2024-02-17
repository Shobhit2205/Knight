import express from "express";
import { allMessagesController, sendMessageController } from "../controllers/messageController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/send-message", protect, sendMessageController)

router.get("/get-messages/:chatId", protect, allMessagesController);

export default router;