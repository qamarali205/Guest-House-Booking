const Guesthouse = require("../models/Guesthouse.model");
const { validationResult } = require("express-validator");

exports.createGuesthouse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ statusCode: 400, errors: errors.array() });
  try {
    const g = await Guesthouse.create(req.body);
    res.status(201).json({
      statusCode: 201,
      message: "Create Guest House details successfully.",
      guestHouse: g,
    });
  } catch (err) {
    const errorMsg = err.message || "Unknown error";
    res.status(500).send({ statusCode: 500, message: errorMsg });
  }
};

exports.listGuesthouses = async (req, res) => {
  try {
    const { city, minPrice, maxPrice } = req.query;
    const filter = {};
    if (city) filter.city = new RegExp("^" + city + "$", "i");
    if (minPrice || maxPrice) filter.pricePerNight = {};
    if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
    if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    const list = await Guesthouse.find(filter);

    res.status(200).send({
      statusCode: 200,
      message: "fetch guesthouses details successfully.",
      list,
    });
  } catch (err) {
    const errorMsg = err.message || "Unknown error";
    res.status(500).send({ statusCode: 500, message: errorMsg });
  }
};
