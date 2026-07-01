import express from "express";
import {
  getSuppliers,
  getSupplierDetail,
  getFarms,
  getFarmDetail,
} from "../controllers/supplier.controller.js";

const router = express.Router();

router.get("/", getSuppliers);
router.get("/farms", getFarms);
router.get("/farms/:id", getFarmDetail);
router.get("/:id", getSupplierDetail);

export default router;