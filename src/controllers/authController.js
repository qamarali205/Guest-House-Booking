const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
require('dotenv').config();
const { generateAccessToken, } = require("../utils/jwt");


exports.register = async (req,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({statusCode: 400, errors: errors.array() });
  
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if(user) return res.status(400).json({statusCode: 400, message: 'Email already in use' });
    user = await User.create({ name, email, password });
    const token = generateAccessToken(user);

    res.status(201).send({
      statusCode: 201,
      message: "User registered successfully.",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
    
  } catch(err){
    const errorMsg = err.message || "Unknown error";
    res.status(500).send({ statusCode: 500, message: errorMsg });
  }
};

exports.login = async (req,res) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()) return res.status(400).json({statusCode: 400, errors: errors.array() });
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({statusCode:400, message: 'Invalid credentials' });
    const isMatch = await user.comparePassword(password);
    if(!isMatch) return res.status(400).json({ statusCode:400, message: 'Invalid credentials' });
    const token = generateAccessToken(user);

     res.status(200).send({
      statusCode: 200,
      message: "User login successfully.",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
 

  } catch(err){
   const errorMsg = err.message || "Unknown error";
    res.status(500).send({ statusCode: 500, message: errorMsg });
  }
};
