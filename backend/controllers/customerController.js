const Customer = require('../models/customer');
const jwt = require('jsonwebtoken');

// Register Customer
exports.registerCustomer = async (req, res) => {
  try {
    const { fullname, email, phone, location, gender, password } = req.body;

    // Validation
    if (!fullname || !email || !phone || !location || !password) {
      return res.status(400).json({ msg: 'Please include all required fields' });
    }

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ msg: 'Customer with this email already exists' });
    }

    // Create new customer
    const newCustomer = new Customer({
      fullname,
      email,
      phone,
      location,
      gender,
      password,
    });

    const savedCustomer = await newCustomer.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        customerId: savedCustomer._id,
        email: savedCustomer.email,
        role: 'customer',
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return customer data without password
    const customerResponse = {
      _id: savedCustomer._id,
      fullname: savedCustomer.fullname,
      email: savedCustomer.email,
      phone: savedCustomer.phone,
      location: savedCustomer.location,
      gender: savedCustomer.gender,
      createdAt: savedCustomer.createdAt,
    };

    res.status(201).json({
      customer: customerResponse,
      token,
      message: 'Customer registered successfully',
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Login Customer
exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide email and password' });
    }

    // Check if customer exists
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if customer is active
    if (!customer.isActive) {
      return res.status(400).json({ msg: 'Account is deactivated. Please contact support.' });
    }

    // Check password
    const isMatch = await customer.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        customerId: customer._id,
        email: customer.email,
        role: 'customer',
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return customer data without password
    const customerResponse = {
      _id: customer._id,
      fullname: customer.fullname,
      email: customer.email,
      phone: customer.phone,
      location: customer.location,
      gender: customer.gender,
    };

    res.json({
      customer: customerResponse,
      token,
      message: 'Login successful',
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all customers (Admin only)
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().select('-password');
    res.status(200).json({ customers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get customer profile
exports.getCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.customerId).select('-password');
    if (!customer) {
      return res.status(404).json({ msg: 'Customer not found' });
    }
    res.json({ customer });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update customer profile
exports.updateCustomerProfile = async (req, res) => {
  try {
    const { fullname, phone, location, gender } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      req.user.customerId,
      { fullname, phone, location, gender },
      { new: true }
    ).select('-password');

    res.json({ customer, message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Authentication middleware
exports.authMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const now = Date.now().valueOf() / 1000;
    if (decoded.exp < now) {
      return res.status(401).json({ msg: 'Token has expired' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.clearCookie('token');
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};
