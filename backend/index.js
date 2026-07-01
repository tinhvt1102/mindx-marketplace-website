import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productRoute from "./routes/product.route.js";
import supplierRoute from "./routes/supplier.route.js";
import supplyRoute from "./routes/supply.route.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/products", productRoute);
app.use("/api/suppliers", supplierRoute);
app.use("/api/supplies", supplyRoute);

app.get("/", (req, res) => {
  res.send("Marketplace VAM Backend is running");
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });