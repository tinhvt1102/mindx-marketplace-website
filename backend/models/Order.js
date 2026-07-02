import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      enum: ["product", "supply"],
      default: "product",
    },

    productId: mongoose.Schema.Types.Mixed,
    supplyId: mongoose.Schema.Types.Mixed,

    name: String,
    image: String,
    price: Number,
    quantity: Number,
    unit: String,

    supplierId: mongoose.Schema.Types.Mixed,
    supplierName: String,
  },
  { _id: false }
);

const shippingInfoSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    address: String,
    province: String,
    district: String,
    ward: String,
    note: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderCode: {
      type: String,
      unique: true,
    },

    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sellerId: mongoose.Schema.Types.Mixed,

    orderType: {
      type: String,
      enum: ["retail", "b2b"],
      default: "retail",
    },

    items: [orderItemSchema],

    shippingInfo: shippingInfoSchema,

    subtotal: {
      type: Number,
      default: 0,
    },

    shippingFee: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      default: 0,
    },

    paymentMethod: {
      type: String,
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    status: {
      type: String,
      enum: [
        "new",
        "processing",
        "shipping",
        "completed",
        "cancelled",
        "rejected",
      ],
      default: "new",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "orders",
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;