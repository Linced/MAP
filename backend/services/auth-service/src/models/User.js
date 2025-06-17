const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100],
    },
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
    allowNull: false,
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'suspended', 'deleted'),
    defaultValue: 'active',
    allowNull: false,
  },
}, {
  timestamps: true,
  paranoid: true, // Enable soft deletes
  defaultScope: {
    attributes: { exclude: ['password'] }, // Exclude password by default
  },
  scopes: {
    withPassword: {
      attributes: {},
    },
  },
});

// Hash password before creating or updating a user
const hashPassword = async (user) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
};

User.beforeCreate(hashPassword);
User.beforeUpdate(hashPassword);

// Instance method to check password
User.prototype.isValidPassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

// Associate with Token model
User.associate = (models) => {
  User.hasMany(models.Token, {
    foreignKey: 'userId',
    as: 'tokens',
  });
};

module.exports = User;
