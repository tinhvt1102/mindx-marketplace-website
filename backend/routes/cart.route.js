import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.put("/items/:itemId", protect, updateCartItem);
router.delete("/items/:itemId", protect, removeCartItem);
router.delete("/clear", protect, clearCart);

export default router;