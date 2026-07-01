import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: String,

    productCode: String,

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    supplierProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SupplierProfile",
    },

    name: String,
    category: String,
    seafoodType: String,
    description: String,

    image: String,
    images: [String],

    price: Number,
    originalPrice: Number,
    unit: String,
    stock: Number,

    origin: String,
    size: String,
    harvestDate: String,

    rating: Number,
    reviews: Number,
    totalReviews: Number,
    sold: Number,

    supplier: {
      name: String,
      verified: Boolean,
      rating: Number,
      location: String,
    },

    productType: {
      type: String,
      default: "retail",
    },

    status: {
      type: String,
      default: "approved",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "products",
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;