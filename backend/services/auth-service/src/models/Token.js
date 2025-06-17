const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Token = sequelize.define('Token', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  type: {
    type: DataTypes.ENUM('refresh', 'reset', 'verify'),
    allowNull: false,
    defaultValue: 'refresh',
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  createdByIp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  revoked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  revokedByIp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  replacedByToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['token'],
    },
    {
      fields: ['userId'],
    },
  ],
});

// Associate with User model
Token.associate = (models) => {
  Token.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user',
  });
};

module.exports = Token;
