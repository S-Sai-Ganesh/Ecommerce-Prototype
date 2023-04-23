const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.get('/user/get-users', userController.getUser);

router.post('/user/add-user', userController.postUser);

router.get('/user/delete-user/:userId', userController.getDelete);

module.exports = router;