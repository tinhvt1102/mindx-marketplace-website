import Product from "../models/Product.js";
import Supply from "../models/Supply.js";
import Order from "../models/Order.js";

export const getSellerDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalProducts = await Product.countDocuments({
      sellerId: userId,
      isDeleted: { $ne: true },
    });

    const totalSupplies = await Supply.countDocuments({
      farmerId: userId,
      isDeleted: { $ne: true },
    });

    const sellerOrders = await Order.find({
      $or: [
        { sellerId: userId },
        { sellerId: String(userId) },
        { "items.supplierId": userId },
        { "items.supplierId": String(userId) },
      ],
      isDeleted: { $ne: true },
    }).sort({ createdAt: -1 });

    const totalOrders = sellerOrders.length;

    const totalRevenue = sellerOrders
      .filter((order) => order.status === "completed")
      .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

    const newOrders = sellerOrders.filter(
      (order) => order.status === "new"
    ).length;

    const processingOrders = sellerOrders.filter(
      (order) => order.status === "processing"
    ).length;

    const completedOrders = sellerOrders.filter(
      (order) => order.status === "completed"
    ).length;

    const pendingSupplies = await Supply.countDocuments({
      farmerId: userId,
      status: "pending",
      isDeleted: { $ne: true },
    });

    const recentOrders = sellerOrders.slice(0, 5);

    const myProducts = await Product.find({
      sellerId: userId,
      isDeleted: { $ne: true },
    })
      .sort({ sold: -1 })
      .limit(5);

    res.status(200).json({
      message: "Get seller dashboard successfully",
      data: {
        totalProducts,
        totalSupplies,
        totalOrders,
        totalRevenue,
        newOrders,
        processingOrders,
        completedOrders,
        pendingSupplies,
        recentOrders,
        bestSellingProducts: myProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getAdminDashboard = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can access this dashboard",
      });
    }

    const totalProducts = await Product.countDocuments({
      isDeleted: { $ne: true },
    });

    const totalSupplies = await Supply.countDocuments({
      isDeleted: { $ne: true },
    });

    const totalOrders = await Order.countDocuments({
      isDeleted: { $ne: true },
    });

    const completedOrders = await Order.find({
      status: "completed",
      isDeleted: { $ne: true },
    });

    const totalRevenue = completedOrders.reduce((sum, order) => {
      return sum + Number(order.totalAmount || 0);
    }, 0);

    const newOrders = await Order.countDocuments({
      status: "new",
      isDeleted: { $ne: true },
    });

    const pendingSupplies = await Supply.countDocuments({
      status: "pending",
      isDeleted: { $ne: true },
    });

    const recentOrders = await Order.find({
      isDeleted: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .limit(5);

    const bestSellingProducts = await Product.find({
      isDeleted: { $ne: true },
    })
      .sort({ sold: -1 })
      .limit(5);

    res.status(200).json({
      message: "Get admin dashboard successfully",
      data: {
        totalProducts,
        totalSupplies,
        totalOrders,
        totalRevenue,
        newOrders,
        pendingSupplies,
        recentOrders,
        bestSellingProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};