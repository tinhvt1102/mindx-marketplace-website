import mongoose from "mongoose";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

const generateOrderCode = () => {
  const now = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  return `ORD-${now}${random}`;
};

const generateUniqueOrderCode = async () => {
  let orderCode;
  let existingOrder;

  do {
    orderCode = generateOrderCode();
    existingOrder = await Order.findOne({ orderCode });
  } while (existingOrder);

  return orderCode;
};

const calculateOrderMoney = (items, shippingFee = 0) => {
  const subtotal = items.reduce((sum, item) => {
    return sum + Number(item.price || 0) * Number(item.quantity || 0);
  }, 0);

  const totalAmount = subtotal + Number(shippingFee || 0);

  return {
    subtotal,
    shippingFee: Number(shippingFee || 0),
    totalAmount,
  };
};

export const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingInfo,
      paymentMethod = "COD",
      shippingFee = 0,
      orderType = "retail",
    } = req.body;

    let orderItems = items;

    if (!orderItems || orderItems.length === 0) {
      const cart = await Cart.findOne({
        userId: req.user._id,
        isDeleted: { $ne: true },
      });

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({
          message: "Cart is empty",
        });
      }

      orderItems = cart.items.map((item) => ({
        itemType: item.itemType,
        productId: item.productId,
        supplyId: item.supplyId,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        unit: item.unit,
        supplierId: item.supplierId,
        supplierName: item.supplierName,
      }));
    }

    if (!shippingInfo?.fullName || !shippingInfo?.phone || !shippingInfo?.address) {
      return res.status(400).json({
        message: "Full name, phone and address are required",
      });
    }

    const orderCode = await generateUniqueOrderCode();

    const money = calculateOrderMoney(orderItems, shippingFee);

    const firstSellerId = orderItems[0]?.supplierId || null;

    const newOrder = await Order.create({
      orderCode,
      buyerId: req.user._id,
      sellerId: firstSellerId,
      orderType,
      items: orderItems,
      shippingInfo,
      subtotal: money.subtotal,
      shippingFee: money.shippingFee,
      totalAmount: money.totalAmount,
      paymentMethod,
      paymentStatus: "pending",
      status: "new",
      isDeleted: false,
    });

    const cart = await Cart.findOne({
      userId: req.user._id,
      isDeleted: { $ne: true },
    });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(201).json({
      message: "Create order successfully",
      data: newOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      buyerId: req.user._id,
      isDeleted: { $ne: true },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Get my orders successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    let filter = {
      isDeleted: { $ne: true },
    };

    if (req.user.role !== "admin") {
      filter = {
        $or: [
          { sellerId: req.user._id },
          { sellerId: String(req.user._id) },
          { "items.supplierId": req.user._id },
          { "items.supplierId": String(req.user._id) },
        ],
        isDeleted: { $ne: true },
      };
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Get seller orders successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const query = {
      $or: [{ orderCode: id }],
      isDeleted: { $ne: true },
    };

    if (mongoose.Types.ObjectId.isValid(id)) {
      query.$or.push({ _id: id });
    }

    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const isBuyer = String(order.buyerId) === String(req.user._id);
    const isSeller = String(order.sellerId) === String(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isBuyer && !isSeller && !isAdmin) {
      return res.status(403).json({
        message: "You do not have permission to view this order",
      });
    }

    res.status(200).json({
      message: "Get order detail successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const allowedStatus = [
      "new",
      "processing",
      "shipping",
      "completed",
      "cancelled",
      "rejected",
    ];

    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const query = {
      $or: [{ orderCode: id }],
      isDeleted: { $ne: true },
    };

    if (mongoose.Types.ObjectId.isValid(id)) {
      query.$or.push({ _id: id });
    }

    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const isSeller = String(order.sellerId) === String(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isSeller && !isAdmin) {
      return res.status(403).json({
        message: "You do not have permission to update this order",
      });
    }

    if (status) {
      order.status = status;
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    res.status(200).json({
      message: "Update order status successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};