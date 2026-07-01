import mongoose from "mongoose";
import Supply from "../models/Supply.js";

export const getSupplies = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const {
      search,
      seafoodType,
      category,
      province,
      location,
      minPrice,
      maxPrice,
      status,
      sort,
    } = req.query;

    const filter = {
      isDeleted: { $ne: true },
      isActive: { $ne: false },
    };

    if (status) {
      filter.status = status;
    } else {
      filter.status = { $in: ["approved", "pending"] };
    }

    if (search) {
      filter.$or = [
        { seafoodType: { $regex: search, $options: "i" } },
        { species: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { province: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (seafoodType) {
      filter.seafoodType = { $regex: seafoodType, $options: "i" };
    }

    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    if (province) {
      filter.province = { $regex: province, $options: "i" };
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.proposedPrice = {};

      if (minPrice) {
        filter.proposedPrice.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.proposedPrice.$lte = Number(maxPrice);
      }
    }

    let sortOption = { createdAt: -1 };

    if (sort === "price_asc") {
      sortOption = { proposedPrice: 1 };
    }

    if (sort === "price_desc") {
      sortOption = { proposedPrice: -1 };
    }

    if (sort === "quantity_desc") {
      sortOption = { quantity: -1 };
    }

    const totalItems = await Supply.countDocuments(filter);

    const supplies = await Supply.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Get supplies successfully",
      data: supplies,
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

export const getSupplyDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const query = {
      $or: [{ id }, { legacyId }, { supplyCode: id }],
      isDeleted: { $ne: true },
    };

    if (mongoose.Types.ObjectId.isValid(id)) {
      query.$or.push({ _id: id });
    }

    const supply = await Supply.findOne(query);

    if (!supply) {
      return res.status(404).json({
        message: "Supply not found",
      });
    }

    const relatedSupplies = await Supply.find({
      _id: { $ne: supply._id },
      seafoodType: supply.seafoodType,
      isDeleted: { $ne: true },
      isActive: { $ne: false },
    }).limit(4);

    res.status(200).json({
      message: "Get supply detail successfully",
      data: {
        supply,
        relatedSupplies,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};