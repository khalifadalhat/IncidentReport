const express = require('express');
const {  sendMessage, getMessages } = require('../controllers/messageController');
const router = express.Router();

router.get('/', getMessages);


router.post('/', sendMessage);

module.exports = router;
