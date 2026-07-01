import express from "express";
import {
  getRetailProducts,
  getProductDetail,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/retail", getRetailProducts);
router.get("/:id", getProductDetail);

export default router;