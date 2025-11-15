const { sequelize } = require('../server');
const { DataTypes } = require('sequelize');
const Cart = require('./Cart');
const Product = require('./Product');

const CartItem = sequelize.define('CartItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  cartId: {
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
      min: { args: [1], msg: 'Quantity must be at least 1' },
      isInt: { msg: 'Quantity must be an integer' },
    },
  }
}, {
  tableName: 'cart_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});


CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items' });

CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(CartItem, { foreignKey: 'productId', as: 'cartItems' });

module.exports = CartItem;