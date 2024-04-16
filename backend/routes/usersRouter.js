
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../authentication/auth');

router.get('/users', userController.getUsers);

router.get('/users/:id/friends', userController.getFriends);

router.post('/users/:id/addFriend', userController.addFriend);

router.get('/isRegistered', authenticateToken, userController.isRegistered);

router.post('/register', userController.register);

router.post('/login', userController.login);

router.get("/log-out", userController.logout);

router.post("/users/:id/deleteFriend", userController.deleteFriend);

router.get("/users/:id", userController.getFriend);
module.exports = router;
