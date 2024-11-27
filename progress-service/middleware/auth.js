const jwt = require('jsonwebtoken');
const User = require('../../user-service/models/userModel');

// Middleware to verify JWT token and attach user to request
const authenticate = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if the user is the same user or an admin
const authorizeStudentOrAdmin = (req, res, next) => {
  const userId = req.user._id.toString();
  const userRole = req.user.role;
  const requestedUserId = req.params.userId;

  if (userRole === 'Admin' || userId === requestedUserId) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Only the same user or an admin can access this resource.' });
  }
};

module.exports = {
  authenticate,
  authorizeStudentOrAdmin,
};