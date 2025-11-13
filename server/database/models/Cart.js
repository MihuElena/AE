const { sequelize } = require('../server'); // la fel ca în Product.js
const { DataTypes } = require('sequelize');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: {
        args: [1],
        msg: 'Quantity must be at least 1',
      },
      isInt: {
        msg: 'Quantity must be an integer',
      },
    },
  },

}, {
  tableName: 'cart',          // numele tabelului în SQLite
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Cart;
