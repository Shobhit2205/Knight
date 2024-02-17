import express from "express";
import { getUserPictureController, RemovePictureController, updateUserInfoController, uploadPictureController, userSearchController } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import fromidable from "express-formidable";

const router = express.Router();

router.get("/search", protect, userSearchController)

router.post("/update-user-info", protect, updateUserInfoController)

router.get("/get-picture/:id", protect, getUserPictureController);

router.put("/remove-picture", protect, RemovePictureController);

router.post("/upload-picture", protect, fromidable(), uploadPictureController);

export default router;
