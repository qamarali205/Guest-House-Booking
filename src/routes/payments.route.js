const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const {authMiddleware } = require('../middleware/authMiddleware');

router.post('/initiate', authMiddleware, paymentController.initiate);
router.post('/verify', paymentController.verify); // webhook style (no auth)
module.exports = router;
