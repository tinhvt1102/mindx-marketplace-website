import mongoose from "mongoose";

const supplierProfileSchema = new mongoose.Schema(
  {
    id: String,
    legacyId: String,

    userId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "User",
    },

    farmName: String,
    name: String,
    ownerName: String,

    type: String,

    phone: String,
    email: String,

    region: String,
    address: String,
    province: String,
    location: String,

    avatar: String,
    image: String,
    coverImage: String,

    description: String,

    certifications: [String],

    establishedYear: Number,

    rating: Number,
    totalReviews: Number,
    reviews: Number,

    isVerified: Boolean,
    verified: Boolean,

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
    collection: "supplierprofiles",
  }
);

const SupplierProfile = mongoose.model(
  "SupplierProfile",
  supplierProfileSchema
);

export default SupplierProfile;