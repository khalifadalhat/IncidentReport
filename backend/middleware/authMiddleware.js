const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Agent = require('../models/agent');

const authMiddleware = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.header('Authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided or invalid format' });
      }
      const token = authHeader.substring(7);

      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        user = await Agent.findById(decoded.userId).select('-password');
      }

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user;
      req.userId = decoded.userId;
      req.userRole = decoded.role;

      // Role check
      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient role permissions' });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);

      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }

      return res.status(401).json({ message: 'Token verification failed' });
    }
  };
};

module.exports = authMiddleware;
