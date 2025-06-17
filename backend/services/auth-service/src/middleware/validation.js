const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const { ApiError } = require('./errorHandler');

// Validation middleware
const validate = (validations) => {
  return async (req, res, next) => {
    try {
      // Run all validations
      await Promise.all(validations.map(validation => validation.run(req)));
      
      // Check for validation errors
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
      
      // Format validation errors
      const formattedErrors = errors.array().map(error => ({
        field: error.param,
        message: error.msg,
        value: error.value,
      }));
      
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Validation failed', formattedErrors);
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  validate,
};
