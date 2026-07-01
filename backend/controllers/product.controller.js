import mongoose from "mongoose";
import Product from "../models/Product.js";

export const getRetailProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const { search, category, origin, minPrice, maxPrice, sort } = req.query;

    const filter = {
      isDeleted: { $ne: true },
      isActive: { $ne: false },
      $or: [
        { productType: "retail" },
        { productType: { $exists: false } },
      ],
    };

    if (search) {
      filter.$and = [
        {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
            { origin: { $regex: search, $options: "i" } },
            { seafoodType: { $regex: search, $options: "i" } },
          ],
        },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (origin) {
      filter.origin = origin;
    }

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    let sortOption = { createdAt: -1 };

    if (sort === "price_asc") {
      sortOption = { price: 1 };
    }

    if (sort === "price_desc") {
      sortOption = { price: -1 };
    }

    if (sort === "sold_desc") {
      sortOption = { sold: -1 };
    }

    const totalItems = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Get retail products successfully",
      data: products,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getProductDetail = async (req, res) => {
  try {
    const { id } = req.params;

    let query = { id };

    if (mongoose.Types.ObjectId.isValid(id)) {
      query = {
        $or: [{ _id: id }, { id }],
      };
    }

    const product = await Product.findOne(query);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isDeleted: { $ne: true },
      isActive: { $ne: false },
    }).limit(4);

    res.status(200).json({
      message: "Get product detail successfully",
      data: {
        product,
        relatedProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};