import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const formatUser = (user) => {
  return {
    id: user._id,
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    avatar: user.avatar,
    role: user.role,
    isActive: user.isActive,
  };
};

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({
      email,
      isDeleted: { $ne: true },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role: role || "buyer",
      isActive: true,
      isDeleted: false,
    });

    const token = createToken(newUser);
    const userData = formatUser(newUser);

    res.status(201).json({
      message: "Register successfully",
      token,
      user: userData,
      data: {
        token,
        user: userData,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email,
      isDeleted: { $ne: true },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        message: "Account is disabled",
      });
    }

    let isMatch = false;

    if (user.password?.startsWith("$2b$")) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = password === user.password;

      if (isMatch) {
        user.password = await bcrypt.hash(password, 10);
        await user.save();
      }
    }

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = createToken(user);
    const userData = formatUser(user);

    res.status(200).json({
      message: "Login successfully",
      token,
      user: userData,
      data: {
        token,
        user: userData,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email,
      isDeleted: { $ne: true },
    });

    if (!user) {
      return res.status(404).json({
        message: "Email not found",
      });
    }

    res.status(200).json({
      message: "Password reset request received",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { email, name, avatar } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    let user = await User.findOne({
      email,
      isDeleted: { $ne: true },
    });

    if (!user) {
      const randomPassword = await bcrypt.hash(Date.now().toString(), 10);

      user = await User.create({
        name: name || email,
        email,
        avatar,
        password: randomPassword,
        role: "buyer",
        isActive: true,
        isDeleted: false,
      });
    }

    const token = createToken(user);
    const userData = formatUser(user);

    res.status(200).json({
      message: "Google login successfully",
      token,
      user: userData,
      data: {
        token,
        user: userData,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  res.status(200).json({
    message: "Logout successfully",
  });
};