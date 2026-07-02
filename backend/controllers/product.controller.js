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
const generateProductCode = () => {
  const random = Math.floor(Math.random() * 100000000)
    .toString()
    .padStart(8, "0");

  return `PRD${random}`;
};

const generateUniqueProductCode = async () => {
  let productCode;
  let existingProduct;

  do {
    productCode = generateProductCode();
    existingProduct = await Product.findOne({ productCode });
  } while (existingProduct);

  return productCode;
};

const canManageProduct = (user, product) => {
  if (user.role === "admin") {
    return true;
  }

  return String(product.sellerId) === String(user._id);
};

export const createProduct = async (req, res) => {
  try {
    if (!["admin", "farmer", "business"].includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to create product",
      });
    }

    const {
      name,
      category,
      seafoodType,
      description,
      image,
      images,
      price,
      originalPrice,
      unit,
      stock,
      origin,
      size,
      harvestDate,
      productType,
    } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({
        message: "Name, category and price are required",
      });
    }

    const productCode = await generateUniqueProductCode();

    const newProduct = await Product.create({
      productCode,
      sellerId: req.user._id,

      name,
      category,
      seafoodType,
      description,

      image,
      images: images || (image ? [image] : []),

      price,
      originalPrice,
      unit: unit || "kg",
      stock: stock || 0,

      origin,
      size,
      harvestDate,

      rating: 0,
      reviews: 0,
      totalReviews: 0,
      sold: 0,

      productType: productType || "retail",
      status: "approved",

      isActive: true,
      isDeleted: false,
    });

    res.status(201).json({
      message: "Create product successfully",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      sellerId: req.user._id,
      isDeleted: { $ne: true },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Get my products successfully",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const query = {
      $or: [{ id }, { legacyId: id }, { productCode: id }],
      isDeleted: { $ne: true },
    };

    if (mongoose.Types.ObjectId.isValid(id)) {
      query.$or.push({ _id: id });
    }

    const product = await Product.findOne(query);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (!canManageProduct(req.user, product)) {
      return res.status(403).json({
        message: "You do not have permission to update this product",
      });
    }

    const allowedFields = [
      "name",
      "category",
      "seafoodType",
      "description",
      "image",
      "images",
      "price",
      "originalPrice",
      "unit",
      "stock",
      "origin",
      "size",
      "harvestDate",
      "productType",
      "status",
      "isActive",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();

    res.status(200).json({
      message: "Update product successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const query = {
      $or: [{ id }, { legacyId: id }, { productCode: id }],
      isDeleted: { $ne: true },
    };

    if (mongoose.Types.ObjectId.isValid(id)) {
      query.$or.push({ _id: id });
    }

    const product = await Product.findOne(query);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (!canManageProduct(req.user, product)) {
      return res.status(403).json({
        message: "You do not have permission to delete this product",
      });
    }

    product.isDeleted = true;
    product.isActive = false;

    await product.save();

    res.status(200).json({
      message: "Delete product successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};