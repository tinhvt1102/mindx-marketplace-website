import SupplierProfile from "../models/SupplierProfile.js";
import Product from "../models/Product.js";

export const getSuppliers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const { search, province, region, verified } = req.query;

    const filter = {
      isDeleted: { $ne: true },
      isActive: { $ne: false },
    };

    if (search) {
      filter.$or = [
        { farmName: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { ownerName: { $regex: search, $options: "i" } },
        { province: { $regex: search, $options: "i" } },
        { region: { $regex: search, $options: "i" } },
      ];
    }

    if (province) {
      filter.province = province;
    }

    if (region) {
      filter.region = region;
    }

    if (verified === "true") {
      filter.$or = [{ isVerified: true }, { verified: true }];
    }

    const totalItems = await SupplierProfile.countDocuments(filter);

    const suppliers = await SupplierProfile.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Get suppliers successfully",
      data: suppliers,
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

export const getSupplierDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await SupplierProfile.findOne({
      $or: [{ _id: id }, { id }, { legacyId: id }],
      isDeleted: { $ne: true },
    });

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    const products = await Product.find({
      $or: [
        { supplierProfileId: supplier._id },
        { supplierProfileId: String(supplier._id) },
        { "supplier.name": supplier.farmName },
        { "supplier.name": supplier.name },
      ],
      isDeleted: { $ne: true },
      isActive: { $ne: false },
    }).limit(12);

    res.status(200).json({
      message: "Get supplier detail successfully",
      data: {
        supplier,
        products,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getFarms = async (req, res) => {
  try {
    const farms = await SupplierProfile.find({
      type: { $in: ["farm", "farmer", "cooperative"] },
      isDeleted: { $ne: true },
      isActive: { $ne: false },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Get farms successfully",
      data: farms,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getFarmDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const farm = await SupplierProfile.findOne({
      $or: [{ _id: id }, { id }, { legacyId: id }],
      isDeleted: { $ne: true },
    });

    if (!farm) {
      return res.status(404).json({
        message: "Farm not found",
      });
    }

    const products = await Product.find({
      $or: [
        { supplierProfileId: farm._id },
        { supplierProfileId: String(farm._id) },
        { "supplier.name": farm.farmName },
        { "supplier.name": farm.name },
      ],
      isDeleted: { $ne: true },
      isActive: { $ne: false },
    }).limit(12);

    res.status(200).json({
      message: "Get farm detail successfully",
      data: {
        farm,
        products,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};