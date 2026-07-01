import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      enum: ["product", "supply"],
      default: "product",
    },

    productId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "Product",
    },

    supplyId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "Supply",
    },

    name: String,
    image: String,
    price: Number,
    quantity: {
      type: Number,
      default: 1,
    },
    unit: String,

    supplierId: mongoose.Schema.Types.Mixed,
    supplierName: String,
  },
  {
    timestamps: true,
  }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [cartItemSchema],

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "carts",
  }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;