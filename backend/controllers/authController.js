const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: "Account is deactivated" });
    }

    const isMatch = await user.comparePassword(password);
    console.log("is password match?:", isMatch);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);

    user.lastLogin = new Date();
    if (user.isFirstLogin) {
      user.isFirstLogin = false;
    }
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        department: user.department,
        phone: user.phone,
        isFirstLogin: user.isFirstLogin,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
};

exports.registerAdmin = async (req, res) => {
  try {
    const { fullname, email, password, phone, location, gender } =
      req.body;

    if (!fullname || !email || !password) {
      return res
        .status(400)
        .json({ error: "fullname, email, and password are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const admin = await User.create({
      fullname,
      email: email.toLowerCase(),
      password,
      phone,
      location,
      gender,
      department: "general",
      role: "admin",
    });

    const token = generateToken(admin);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: admin._id,
        fullname: admin.fullname,
        email: admin.email,
        role: admin.role,
        department: admin.department,
      },
    });
  } catch (err) {
    console.error("Register Admin Error:", err);
    res.status(500).json({ error: "Admin registration failed" });
  }
};

exports.registerCustomer = async (req, res) => {
  try {
    const { fullname, email, password, phone, location, gender, role } =
      req.body;

    if (!email || !password || !fullname) {
      return res
        .status(400)
        .json({ error: "fullname, email, and password required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const user = await User.create({
      fullname,
      email: email.toLowerCase(),
      password,
      phone,
      location,
      gender,
      role,
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.logout = (req, res) => {
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

exports.forgotPassword = async (req, res) => {
  res.status(501).json({ message: "Password reset not implemented yet" });
};

module.exports = {
  login: exports.login,
  registerAdmin: exports.registerAdmin,
  registerCustomer: exports.registerCustomer,
  logout: exports.logout,
  forgotPassword: exports.forgotPassword,
};
