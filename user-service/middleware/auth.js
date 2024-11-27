const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // Extract token from the Authorization header (Bearer token)
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        // Verify the JWT token using the secret key
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach the user info to the request object (req.user)
        req.user = verified;

        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token' });
    }
};

// Role-based authorization middleware (Admin only)
const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next(); // User is authorized, proceed to the next middleware/handler
};

// Role-based authorization middleware (User only)
const authorizeUser = (req, res, next) => {
    if (req.user.role !== 'Student') {
        return res.status(403).json({ message: 'Access denied: Users only' });
    }
    next(); // User is authorized, proceed to the next middleware/handler
};

// Middleware to check if the user is the same student or an admin
const authorizeStudentOrAdmin = (req, res, next) => {
    const userId = req.user._id;
    const userRole = req.user.role;
    const requestedUserId = req.params.id;
  
    if (userRole === 'Admin' || userId === requestedUserId) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Only the same student or an admin can access this resource.' });
    }
  };

// Export both authentication and authorization middlewares
module.exports = {
    authenticateToken,
    authorizeAdmin,
    authorizeUser,
    authorizeStudentOrAdmin
};