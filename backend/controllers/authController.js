const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { createOTP, verifyOTP, isOTPVerified } = require("../utils/otpUtils");
const { sendWelcomeEmail } = require("../utils/welcomeEmail");
const { sendLoginNotification } = require("../utils/sendLoginNotification");

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
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);

    user.lastLogin = new Date();
    if (user.isFirstLogin) {
      user.isFirstLogin = false;
    }
    await user.save({ validateBeforeSave: false });

    if (user.isFirstLogin) {
      sendLoginNotification(user.email, user.fullname).catch((err) =>
        console.error("Login notification failed:", err)
      );
    }

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

exports.requestRegistrationOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ error: "Email already registered" });
    }

    await createOTP(email.toLowerCase(), "registration");

    res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (err) {
    console.error("Request OTP error:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

exports.verifyRegistrationOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const result = await verifyOTP(email.toLowerCase(), otp, "registration");

    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    res.status(200).json({
      success: true,
      message: "OTP verified. You can now complete registration.",
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ error: "OTP verification failed" });
  }
};

exports.registerCustomer = async (req, res) => {
  try {
    const { fullname, email, password, phone, location, gender, role } =
      req.body;

    if (!email || !password || !fullname) {
      return res
        .status(400)
        .json({ error: "Fullname, email, and password required" });
    }

    const otpVerified = await isOTPVerified(
      email.toLowerCase(),
      "registration"
    );
    if (!otpVerified) {
      return res
        .status(403)
        .json({ error: "Please verify your email with OTP first" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
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
      role: role || "customer",
    });

    const token = generateToken(user);

    sendWelcomeEmail(user.email, user.fullname).catch((err) =>
      console.error("Welcome email failed:", err)
    );

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

exports.registerAdmin = async (req, res) => {
  try {
    const { fullname, email, password, phone, location, gender } = req.body;

    if (!fullname || !email || !password) {
      return res
        .status(400)
        .json({ error: "Fullname, email, and password are required" });
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

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await createOTP(email.toLowerCase(), "password-reset");

    res.status(200).json({
      success: true,
      message: "Password reset OTP sent to your email",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Failed to process request" });
  }
};

exports.verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const result = await verifyOTP(email.toLowerCase(), otp, "password-reset");

    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    res.status(200).json({
      success: true,
      message: "OTP verified. You can now reset your password.",
    });
  } catch (err) {
    console.error("Verify reset OTP error:", err);
    res.status(500).json({ error: "OTP verification failed" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ error: "Email and new password are required" });
    }

    const otpVerified = await isOTPVerified(
      email.toLowerCase(),
      "password-reset"
    );
    if (!otpVerified) {
      return res.status(403).json({ error: "Please verify OTP first" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
};

exports.requestChangePasswordOTP = async (req, res) => {
  try {
    const { email } = req.user;

    await createOTP(email, "password-change");

    res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (err) {
    console.error("Request change password OTP error:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, otp } = req.body;
    const { email } = req.user;

    if (!currentPassword || !newPassword || !otp) {
      return res.status(400).json({
        error: "Current password, new password, and OTP are required",
      });
    }

    const otpResult = await verifyOTP(email, otp, "password-change");
    if (!otpResult.success) {
      return res.status(400).json({ error: otpResult.message });
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ error: "Failed to change password" });
  }
};

exports.logout = (req, res) => {
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

module.exports = {
  login: exports.login,
  requestRegistrationOTP: exports.requestRegistrationOTP,
  verifyRegistrationOTP: exports.verifyRegistrationOTP,
  registerCustomer: exports.registerCustomer,
  registerAdmin: exports.registerAdmin,
  forgotPassword: exports.forgotPassword,
  verifyResetOTP: exports.verifyResetOTP,
  resetPassword: exports.resetPassword,
  requestChangePasswordOTP: exports.requestChangePasswordOTP,
  changePassword: exports.changePassword,
  logout: exports.logout,
};
