// createAdmin.js — FINAL VERSION
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const bcrypt = require('bcryptjs');

(async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 30000,
      connectWithNoPrimary: true,
    });
    console.log("Connected!");

    const hashed = await bcrypt.hash('@Dalheart1', 12);
    console.log("Password hashed");

    // Delete old admin if exists
    await User.deleteOne({ email: 'khalifadalhat@gmail.com' });
    console.log("Old admin removed");

    // Create fresh admin
    const admin = await User.create({
      fullname: "Khalifa Dalhat",
      email: "khalifadalhat@gmail.com",
      password: hashed,
      role: "admin",
      department: "general", // ← must match your enum
      phone: "08032351868",
      location: "Abuja, Nigeria",
      isActive: true,
      isFirstLogin: false,
    });

    console.log("ADMIN CREATED SUCCESSFULLY!");
    console.log("Email: khalifadalhat@gmail.com");
    console.log("Password: @Dalheart1");
    console.log("Role: admin");
    console.log("");
    console.log("Login now at: http://localhost:5173/login");

    process.exit(0);
  } catch (err) {
    console.error("Failed:", err.message);
    process.exit(1);
  }
})();