const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const secret = process.env.JWT_SECRET;

// Middleware to verify JWT token
const authMiddleware = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ statusCode: 401, message: "Unauthorized: No token provided" });
  }

  try {
    token = token.split(" ")[1];
    const decoded = jwt.verify(token, secret);
    
   req.userData = await User.findById(decoded.id);
   req.user = { 
    ...decoded,       
  };
  // console.log("Decoded Token:", req.userData);  // 👈 LOG THIS

    if (!req.userData) return res.status(401).json({ statusCode: 401, message: "User not found" });

    next();
  } catch (error) {

     // Handle token expiration error
     if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        statusCode: 401,
        message: "Unauthorized: Token has expired",
        expiredAt: error.expiredAt, // Optionally send the expiration date
      });
    }

    return res.status(401).json({statusCode: 401, message: "Unauthorized: Invalid token" });
  }
};

// // Middleware to restrict routes based on role
// const authorizeRoles = (...roles) => {
//   // console.log(roles);
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({statusCode: 403,message: "Access Denied: Insufficient role" });
//     }
//     next();
//   };
// };

// Middleware to restrict routes based on role
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check if the user's role is not included in the allowed roles
    if (!roles.includes(req.user.role)) {
      // Custom error message with a list of roles
      let rolesMessage = roles.join(', '); // Join roles with commas
      if (roles.length > 2) {
        // If more than two roles, add "and" before the last role
        const lastCommaIndex = rolesMessage.lastIndexOf(',');
        rolesMessage = rolesMessage.slice(0, lastCommaIndex) + ' and' + rolesMessage.slice(lastCommaIndex + 1);
      }

      return res.status(403).json({
        statusCode: 403,
        message: `Access Denied: Only ${rolesMessage} can access this facility.`
      });
    }
    next(); // If role is valid, move to the next middleware
  };
};

module.exports = { authMiddleware, authorizeRoles };
