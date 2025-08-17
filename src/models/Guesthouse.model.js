const mongoose = require("mongoose");

const guesthouseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      index: true,
    },
    address: {
      type: String,
    },
    rooms: {
      type: Number,
      required: true,
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    amenities: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Guesthouse", guesthouseSchema);
