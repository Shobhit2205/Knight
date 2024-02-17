import express from "express";
import {
  forgotPassword,
  loginController,
  registerUserController,
  resetPassword,
  sendOTP,
  verifyOTP,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUserController, sendOTP);

router.post("/verify-otp", verifyOTP);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.post("/login", loginController);

export default router;
