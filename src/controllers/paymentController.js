const Payment = require("../models/Payment.model");
const Booking = require("../models/Booking.model");
const { v4: uuidv4 } = require("uuid");

exports.initiate = async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId)
      return res
        .status(400)
        .json({ statusCode: 400, message: "bookingId required" });
    const booking = await Booking.findById(bookingId);
    if (!booking)
      return res
        .status(404)
        .json({ statusCode: 404, message: "Booking not found" });
    if (String(booking.userId) !== String(req.user.id))
      return res.status(403).json({ statusCode: 403, message: "Forbidden" });

    const transactionId = "txn_" + uuidv4();
    const payment = await Payment.create({
      bookingId,
      amount: booking.totalAmount,
      status: "initiated",
      transactionId,
    });

    res.status(200).send({
      statusCode: 200,
      payment: {
        id: payment._id,
        transactionId,
        status: payment.status,
        amount: payment.amount,
      },
      paymentUrl: `https://mockpay.example/pay/${transactionId}`,
    });
  } catch (err) {
    const errorMsg = err.message || "Unknown error";
    res.status(500).send({ statusCode: 500, message: errorMsg });
  }
};

exports.verify = async (req, res) => {
  try {
    const { transactionId, success } = req.body;
    if (!transactionId)
      return res
        .status(400)
        .json({ statusCode: 400, message: "transactionId required" });
    const payment = await Payment.findOne({ transactionId });
    if (!payment)
      return res
        .status(404)
        .json({ statusCode: 404, message: "Payment not found" });

    if (success) {
      payment.status = "success";
      await payment.save();
      const booking = await Booking.findById(payment.bookingId);
      if (booking) {
        booking.status = "confirmed";
        await booking.save();
      }

      res.status(200).send({
        statusCode: 200,
        message: "Payment verified, booking confirmed",
        payment,
      });
    } else {
      payment.status = "failed";
      await payment.save();

      res.status(200).send({
        statusCode: 200,
        message: "Payment failed",
        payment,
      });
    }
  } catch (err) {
    const errorMsg = err.message || "Unknown error";
    res.status(500).send({ statusCode: 500, message: errorMsg });
  }
};
