import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: String,
    legacyId: String,

    name: String,

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: String,
    address: String,
    avatar: String,

    role: {
      type: String,
      enum: ["buyer", "business", "farmer", "admin"],
      default: "buyer",
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
    collection: "users",
  }
);

const User = mongoose.model("User", userSchema);

export default User;