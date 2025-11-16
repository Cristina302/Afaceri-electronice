const express = require("express");
const { Cart, CartItem, Product } = require("../database/models");
const { verifyToken } = require("../utils/token.js");
const recalculateCartTotal = require('../utils/recalculateCartTotal.js');

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({
      where: { userId: req.userId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    if (!cart) {
      cart = await Cart.create({ userId: req.userId, status: "active", total_price: 0 });
    }

    res.status(200).json({
      success: true,
      message: "Cart retrieved",
      data: cart,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error retrieving cart", data: err.message });
  }
});

router.post("/add", verifyToken, async (req, res) => {
    const { productId, quantity } = req.body;

  try {
      let cart = await Cart.findOne({ where: { userId: req.userId } });
    if (!cart) {
      cart = await Cart.create({ userId: req.userId, status: "active", total_price: 0 });
    }

      const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

      let cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId } });

      if (cartItem != null) {
        await cartItem.update({ quantity: cartItem.quantity + quantity });
    } else {
        cartItem = await CartItem.create({ cartId: cart.id, productId, quantity });
    }
    await recalculateCartTotal(cart.id);

    res.status(200).json({ success: true, message: "Product added to cart", data: cartItem });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error adding product to cart", data: err.message });
  }
});

router.put("/item/:id", verifyToken, async (req, res) => {
  const { quantity } = req.body;

  try {
    const item = await CartItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    const cart = await Cart.findByPk(item.cartId);
    if (cart.userId !== req.userId) return res.status(403).json({ success: false, message: "Unauthorized" });

    item.quantity = quantity;
      await item.save();

    await recalculateCartTotal(cart.id);
    
    const updatedItem = await CartItem.findByPk(item.id, {
      include: [{ model: Product, as: "product" }]
    });
    
    const updatedCart = await Cart.findByPk(cart.id, {
      include: [{
        model: CartItem,
        as: "items",
        include: [{ model: Product, as: "product" }],
      }],
    });
    console.log("json", {
      success: true,
      message: "Item updated",
      data: { cart: updatedCart, updatedItem }
    });
    res.json({
      success: true,
      message: "Item updated",
      data: { cart: updatedCart, updatedItem }
    });
  } catch (err) {
      
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/item/:id", verifyToken, async (req, res) => {
  try {
    const item = await CartItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    const cart = await Cart.findByPk(item.cartId);
    if (cart.userId !== req.userId) return res.status(403).json({ success: false, message: "Unauthorized" });

    await item.destroy();

    await recalculateCartTotal(cart.id);

    res.json({ success: true, message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/status", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const cart = await Cart.findOne({ where: { userId: req.userId } });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.status = status;
    await cart.save();

    res.json({ success: true, message: "Status updated", data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/clear", verifyToken, async (req, res) => {
  try {
    
    const cart = await Cart.findOne({ where: { userId: req.userId } });

    if (!cart)
      return res.json({ success: true, message: "Cart already empty" });

    await CartItem.destroy({ where: { cartId: cart.id } });

    await cart.destroy();

    res.json({ success: true, message: "Cart cleared" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
