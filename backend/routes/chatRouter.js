const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');

router.get('/messages/:userId/:friendId', messagesController.getMessages);
  

module.exports = router;