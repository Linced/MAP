const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { StatusCodes } = require('http-status-codes');
const { ApiError } = require('../middleware/errorHandler');
const User = require('../models/User');
const Token = require('../models/Token');
const logger = require('../utils/logger');
const config = require('../../shared/config');
const emailService = require('../services/emailService');

// Generate JWT token
const generateToken = (userId, expiresIn = '24h') => {
  return jwt.sign({ userId }, config.jwt.secret, { expiresIn });
};

// Generate refresh token
const generateRefreshToken = async (userId, ipAddress) => {
  const refreshToken = uuidv4();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  await Token.create({
    token: refreshToken,
    userId,
    expiresAt,
    createdByIp: ipAddress,
  });
  
  return refreshToken;
};

// Generate access and refresh tokens
const generateAuthTokens = async (userId, ipAddress) => {
  const accessToken = generateToken(userId, '15m');
  const refreshToken = await generateRefreshToken(userId, ipAddress);
  
  return { accessToken, refreshToken };
};

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already in use');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role: 'user',
    });
    
    // Generate tokens
    const tokens = await generateAuthTokens(user.id, req.ip);
    
    // Send welcome email
    await emailService.sendWelcomeEmail(user.email, user.name);
    
    res.status(StatusCodes.CREATED).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
    }
    
    // Generate tokens
    const tokens = await generateAuthTokens(user.id, req.ip);
    
    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Refresh access token
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    // Find token in database
    const token = await Token.findOne({
      where: { token: refreshToken },
      include: [{ model: User }],
    });
    
    if (!token || !token.user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Invalid refresh token');
    }
    
    // Check if token is expired
    if (token.expiresAt < new Date()) {
      await token.destroy();
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh token expired');
    }
    
    // Generate new tokens
    const tokens = await generateAuthTokens(token.user.id, req.ip);
    
    // Delete old refresh token
    await token.destroy();
    
    res.status(StatusCodes.OK).json({
      success: true,
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};

// Logout user
exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      // Delete the refresh token
      await Token.destroy({ where: { token: refreshToken } });
    }
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });
    
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }
    
    res.status(StatusCodes.OK).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Change password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    
    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Current password is incorrect');
    }
    
    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    
    // Invalidate all refresh tokens
    await Token.destroy({ where: { userId } });
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Forgot password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Don't reveal that the email doesn't exist
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'If your email is registered, you will receive a password reset link',
      });
    }
    
    // Generate reset token
    const resetToken = generateToken(user.id, '1h');
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    // Send password reset email
    await emailService.sendPasswordResetEmail(user.email, user.name, resetUrl);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'If your email is registered, you will receive a password reset link',
    });
  } catch (error) {
    next(error);
  }
};

// Reset password
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    
    // Verify token
    let userId;
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      userId = decoded.userId;
    } catch (error) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid or expired token');
    }
    
    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }
    
    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    
    // Invalidate all refresh tokens
    await Token.destroy({ where: { userId } });
    
    // Send password changed email
    await emailService.sendPasswordChangedEmail(user.email, user.name);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
};
