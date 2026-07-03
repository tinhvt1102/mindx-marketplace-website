import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getSupplies,
  getSupplyDetail,
  createSupply,
  getMySupplies,
  updateSupply,
  deleteSupply,
} from "../controllers/supply.controller.js";

const router = express.Router();

router.get("/", getSupplies);
router.get("/my-supplies", protect, getMySupplies);

router.post("/", protect, createSupply);
router.put("/:id", protect, updateSupply);
router.delete("/:id", protect, deleteSupply);

router.get("/:id", getSupplyDetail);

export default router;