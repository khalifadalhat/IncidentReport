const express = require('express');
const router = express.Router();
const {
  registerCustomer,
  loginCustomer,
  getCustomers,
  getCustomerProfile,
  updateCustomerProfile,
  authMiddleware,
} = require('../controllers/customerController');

// Public routes
router.post('/register', registerCustomer);
router.post('/login', authMiddleware, loginCustomer);

// Protected routes
router.get('/profile', authMiddleware, getCustomerProfile);
router.put('/profile', authMiddleware, updateCustomerProfile);

// Admin only routes
router.get('/', getCustomers);

module.exports = router;
