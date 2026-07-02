import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getRetailProducts,
  getProductDetail,
  createProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/retail", getRetailProducts);
router.get("/my-products", protect, getMyProducts);

router.post("/", protect, createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

router.get("/:id", getProductDetail);

export default router;