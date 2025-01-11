const Customer = require('../models/customer');
const authMiddleware = require('../middleware/authMiddleware');

exports.createCustomer = [
  authMiddleware,
  async (req, res) => {
    const { fullname, email, phone, location } = req.body;

    console.log('Incoming request:', req.body);

    if (!fullname || !email || !phone || !location) {
      return res.status(400).json({ msg: 'Please include all fields' });
    }

    try {
      const newCustomer = new Customer({ fullname, email, phone, location });
      const savedCustomer = await newCustomer.save();
      res.json(savedCustomer);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
];

exports.getCustomers = [
  authMiddleware,
  async (req, res) => {
    try {
      const customers = await Customer.find();
      res.status(200).json({ customers });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];