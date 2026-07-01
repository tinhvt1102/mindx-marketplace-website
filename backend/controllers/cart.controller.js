import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Supply from "../models/Supply.js";

const calculateCartTotal = (cart) => {
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const totalAmount = cart.items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  return {
    totalItems,
    totalAmount,
  };
};

const findProductByAnyId = async (id) => {
  const query = {
    $or: [{ id }, { legacyId: id }, { productCode: id }],
  };

  if (mongoose.Types.ObjectId.isValid(id)) {
    query.$or.push({ _id: id });
  }

  return Product.findOne(query);
};

const findSupplyByAnyId = async (id) => {
  const query = {
    $or: [{ id }, { legacyId: id }, { supplyCode: id }],
  };

  if (mongoose.Types.ObjectId.isValid(id)) {
    query.$or.push({ _id: id });
  }

  return Supply.findOne(query);
};

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      userId: req.user._id,
      isDeleted: { $ne: true },
    });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user._id,
        items: [],
        isDeleted: false,
      });
    }

    const summary = calculateCartTotal(cart);

    res.status(200).json({
      message: "Get cart successfully",
      data: {
        cart,
        ...summary,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, supplyId, itemType = "product", quantity = 1 } = req.body;

    if (itemType === "product" && !productId) {
      return res.status(400).json({
        message: "Product id is required",
      });
    }

    if (itemType === "supply" && !supplyId) {
      return res.status(400).json({
        message: "Supply id is required",
      });
    }

    let sourceItem;

    if (itemType === "product") {
      sourceItem = await findProductByAnyId(productId);
    } else {
      sourceItem = await findSupplyByAnyId(supplyId);
    }

    if (!sourceItem) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    let cart = await Cart.findOne({
      userId: req.user._id,
      isDeleted: { $ne: true },
    });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user._id,
        items: [],
        isDeleted: false,
      });
    }

    const itemIdToCompare =
      itemType === "product" ? String(sourceItem._id) : String(sourceItem._id);

    const existingItem = cart.items.find((item) => {
      if (itemType === "product") {
        return String(item.productId) === itemIdToCompare;
      }

      return String(item.supplyId) === itemIdToCompare;
    });

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({
        itemType,
        productId: itemType === "product" ? sourceItem._id : undefined,
        supplyId: itemType === "supply" ? sourceItem._id : undefined,

        name: sourceItem.name || sourceItem.seafoodType,
        image: sourceItem.image || sourceItem.images?.[0] || "",
        price: sourceItem.price || sourceItem.proposedPrice || 0,
        quantity: Number(quantity),
        unit: sourceItem.unit || "kg",

        supplierId: sourceItem.sellerId || sourceItem.farmerId || "",
        supplierName:
          sourceItem.supplier?.name ||
          sourceItem.supplierName ||
          "Nhà cung cấp",
      });
    }

    await cart.save();

    const summary = calculateCartTotal(cart);

    res.status(200).json({
      message: "Add to cart successfully",
      data: {
        cart,
        ...summary,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || Number(quantity) < 1) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    const cart = await Cart.findOne({
      userId: req.user._id,
      isDeleted: { $ne: true },
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    item.quantity = Number(quantity);

    await cart.save();

    const summary = calculateCartTotal(cart);

    res.status(200).json({
      message: "Update cart item successfully",
      data: {
        cart,
        ...summary,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({
      userId: req.user._id,
      isDeleted: { $ne: true },
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter((item) => String(item._id) !== itemId);

    await cart.save();

    const summary = calculateCartTotal(cart);

    res.status(200).json({
      message: "Remove cart item successfully",
      data: {
        cart,
        ...summary,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      userId: req.user._id,
      isDeleted: { $ne: true },
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    res.status(200).json({
      message: "Clear cart successfully",
      data: {
        cart,
        totalItems: 0,
        totalAmount: 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};