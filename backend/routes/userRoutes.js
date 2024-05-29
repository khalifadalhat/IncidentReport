const express = require('express');
const { createUser, getUsers, loginUser } = require('../controllers/userController');

const router = express.Router();

router.post('/signup', createUser);
router.post('/login', loginUser);
router.get('/', getUsers);

module.exports = router;
