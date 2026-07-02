import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  getMyOrders,
  getSellerOrders,
  getOrderDetail,
  updateOrderStatus,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/seller-orders", protect, getSellerOrders);
router.get("/:id", protect, getOrderDetail);
router.patch("/:id/status", protect, updateOrderStatus);

export default router;