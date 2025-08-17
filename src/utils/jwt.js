const jwt = require('jsonwebtoken');
require('dotenv').config(); 

const secret = process.env.JWT_SECRET;
const accessTokenTime = process.env.JWT_EXPIRES_IN;

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id,
          role: user.role,  
         },
        secret,
        { expiresIn: accessTokenTime }
    );
};



module.exports = {generateAccessToken };

