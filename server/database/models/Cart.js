const { sequelize } = require("../server");
const { DataTypes } = require("sequelize");
const User = require("./User");

const Cart = sequelize.define(
  "Cart",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("active", "processing", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "active",
      validate: {
        isIn: {
          args: [["active", "processing", "completed", "cancelled"]],
          msg: "Invalid cart status",
        },
      },
    },

    total_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "carts",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Cart.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Cart, { foreignKey: "userId", as: "carts" });

module.exports = Cart;
