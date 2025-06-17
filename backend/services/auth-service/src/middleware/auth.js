const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { ApiError } = require('./errorHandler');
const User = require('../models/User');
const config = require('../../../shared/config');

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication required');
    }

    const token = authHeader.split(' ')[1];
    
    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret);
      
      // Check if user still exists
      const user = await User.findByPk(decoded.userId, {
        attributes: { exclude: ['password'] },
      });
      
      if (!user) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'User not found');
      }
      
      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Token expired');
      }
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token');
    }
  } catch (error) {
    next(error);
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication required');
      }
      
      if (!roles.includes(req.user.role)) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'Not authorized to access this resource');
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  authenticate,
  authorize,
};
