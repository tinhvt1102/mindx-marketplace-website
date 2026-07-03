import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getSellerDashboard,
  getAdminDashboard,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/seller", protect, getSellerDashboard);
router.get("/admin", protect, getAdminDashboard);

export default router;