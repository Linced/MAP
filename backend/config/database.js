const { Sequelize } = require('sequelize');
const config = require('../shared/config');
const logger = require('../services/auth-service/src/utils/logger');

// Initialize Sequelize with database configuration
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  username: config.database.user,
  password: config.database.password,
  logging: (msg) => logger.debug(msg), // Log SQL queries in development
  define: {
    underscored: true, // Use snake_case for database fields
    timestamps: true, // Add createdAt and updatedAt timestamps
    paranoid: true, // Enable soft deletes
    defaultScope: {
      attributes: {
        exclude: ['deletedAt'], // Exclude deletedAt by default
      },
    },
  },
  pool: {
    max: 10, // Maximum number of connections in pool
    min: 0,  // Minimum number of connections in pool
    acquire: 30000, // Maximum time (ms) that a connection can be idle before being released
    idle: 10000, // Maximum time (ms) that a connection can be idle before being released
  },
});

// Test the database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
    return true;
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    return false;
  }
};

// Sync all models with the database
const syncDatabase = async (options = {}) => {
  try {
    const { force = false, alter = false } = options;
    
    if (force) {
      logger.warn('Forcing database sync. This will drop all tables!');
    } else if (alter) {
      logger.warn('Altering database tables to match models');
    }
    
    await sequelize.sync({ force, alter });
    logger.info('Database synchronized successfully');
    return true;
  } catch (error) {
    logger.error('Error syncing database:', error);
    return false;
  }
};

// Export the Sequelize instance and utility functions
module.exports = {
  sequelize,
  Sequelize,
  testConnection,
  syncDatabase,
};
