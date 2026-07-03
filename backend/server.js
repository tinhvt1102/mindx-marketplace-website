import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productRoute from "./routes/product.route.js";
import supplierRoute from "./routes/supplier.route.js";
import supplyRoute from "./routes/supply.route.js";
import authRoute from "./routes/auth.route.js";
import cartRoute from "./routes/cart.route.js";
import orderRoute from "./routes/order.route.js";
import dashboardRoute from "./routes/dashboard.route.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/products", productRoute);
app.use("/api/suppliers", supplierRoute);
app.use("/api/supplies", supplyRoute);
app.use("/api/Auth", authRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/dashboard", dashboardRoute);

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