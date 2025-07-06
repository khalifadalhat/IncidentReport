const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword, role });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, 'BIZZAPP');
    newUser.token = token;
    await newUser.save();

    res.cookie('token', token, { httpOnly: true }); 
    res.status(201).json({ user: newUser, token }); 
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getUsers = [
  async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json({ users });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];