import mongoose from "mongoose";

const supplySchema = new mongoose.Schema(
  {
    id: String,
    legacyId: String,

    supplyCode: String,

    farmerId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "User",
    },

    supplierProfileId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "SupplierProfile",
    },

    supplierId: String,

    seafoodType: String,
    species: String,
    category: String,

    size: String,
    quantity: Number,
    unit: String,

    harvestDate: String,

    proposedPrice: Number,
    price: Number,
    priceText: String,

    location: String,
    province: String,
    origin: String,

    description: String,

    image: String,
    images: [String],

    certifications: [String],

    status: {
      type: String,
      default: "approved",
    },

    supplier: {
      name: String,
      verified: Boolean,
      rating: Number,
      location: String,
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
    collection: "supplies",
  }
);

const Supply = mongoose.model("Supply", supplySchema);

export default Supply;