const { Cart, CartItem, Product } = require('../database/models');

async function recalculateCartTotal(cartId) {

  if (!cartId) return null;
  const items = await CartItem.findAll({
    where: { cartId },
    include: [{ model: Product, as: 'product' }],
  });

  let total = 0;
  for (const it of items) {
    const price = it.product?.price ?? 0;
    total += price * it.quantity;
  }

  const cart = await Cart.findByPk(cartId);
  if (!cart) return null;
  cart.total_price = total;
  cart.update(cart);
  await cart.save();

  return cart;
}

module.exports = recalculateCartTotal;
