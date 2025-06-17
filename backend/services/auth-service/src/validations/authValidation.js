const { body } = require('express-validator');
const { User } = require('../../models');

// Common validation rules
const emailValidation = body('email')
  .trim()
  .toLowerCase()
  .isEmail()
  .withMessage('Please provide a valid email address')
  .isLength({ max: 255 })
  .withMessage('Email must be less than 255 characters');

const passwordValidation = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[a-z]/)
  .withMessage('Password must contain at least one lowercase letter')
  .matches(/[0-9]/)
  .withMessage('Password must contain at least one number')
  .matches(/[^A-Za-z0-9]/)
  .withMessage('Password must contain at least one special character');

// Register validation schema
const registerSchema = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name must be less than 100 characters'),
  
  emailValidation.custom(async (email) => {
    const user = await User.findOne({ where: { email } });
    if (user) {
      throw new Error('Email already in use');
    }
    return true;
  }),
  
  passwordValidation,
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

// Login validation schema
const loginSchema = [
  emailValidation,
  body('password').notEmpty().withMessage('Password is required'),
];

// Refresh token validation schema
const refreshTokenSchema = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required'),
];

// Forgot password validation schema
const forgotPasswordSchema = [emailValidation];

// Reset password validation schema
const resetPasswordSchema = [
  body('token').notEmpty().withMessage('Token is required'),
  passwordValidation,
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
];

// Change password validation schema
const changePasswordSchema = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  passwordValidation,
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
];

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
};
