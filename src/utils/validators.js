const { body } = require('express-validator');

const registerValidator = [
  body('name').notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min:6 }).withMessage('Password at least 6 chars')
];

const loginValidator = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
];

const guesthouseCreateValidator = [
  body('name').notEmpty(),
  body('city').notEmpty(),
  body('rooms').isInt({ min: 1 }),
  body('pricePerNight').isFloat({ gt: 0 })
];

module.exports = { registerValidator, loginValidator, guesthouseCreateValidator };
