import express from "express";
import {
  register,
  login,
  forgotPassword,
  googleLogin,
  logout,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/google-login", googleLogin);
router.post("/logout", logout);

export default router;