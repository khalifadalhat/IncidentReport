const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/users', userController.createUser);
router.get('/users', authMiddleware, userController.getUsers);

module.exports = router;
