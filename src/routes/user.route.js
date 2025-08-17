const express = require('express');
const router = express.Router();
const userController = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../utils/validators');

router.post('/register', registerValidator, userController.register);
router.post('/login', loginValidator, userController.login);

module.exports = router;
