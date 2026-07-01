import express from "express";
import {
  getSupplies,
  getSupplyDetail,
} from "../controllers/supply.controller.js";

const router = express.Router();

router.get("/", getSupplies);
router.get("/:id", getSupplyDetail);

export default router;