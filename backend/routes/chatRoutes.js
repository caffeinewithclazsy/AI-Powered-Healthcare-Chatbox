const express = require('express');
const router = express.Router();

// Import controllers
const chatController = require('../controllers/chatController');

// Chat endpoint
router.post('/chat', chatController.getChatResponse);

module.exports = router;