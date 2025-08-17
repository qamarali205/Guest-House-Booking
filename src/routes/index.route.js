const express = require('express');
const router = express.Router();

const userRoutes = require('./user.route');
const guesthouseRoutes = require('./guesthouses.route');
const bookingRoutes = require('./bookings.route');
const paymentRoutes = require('./payments.route');


// routes
router.use('/auth', userRoutes);
router.use('/guesthouses', guesthouseRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);

module.exports = router;
