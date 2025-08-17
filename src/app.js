require("dotenv").config();
const connectDB = require("./config/db");
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const Routes = require('./routes/index.route');


const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use(helmet());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: process.env.RATE_LIMIT || 100, // limit each IP to 100 requests per windowMs
  message: { error: "Too many requests, please try again later." },
  // statusCode: 429,
  trustProxy: true,
});

app.use(limiter);

app.use('/api', Routes);

app.get('/', (req,res) =>   res.status(200).json({
    message: "Guest House Booking backend Code working fine...........",
    url: `${req.protocol}://${req.get("host")}`,
  }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ status:500,  message: 'Server error' });
});

connectDB();


module.exports = app;