import { useEffect, useState } from "react";
import {
  getMyCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
} from "../api/cart.routes";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "sonner";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const { success, data, message } = await getMyCart();
        if (success) setCart(data);
        else toast.error(message || "Failed to fetch cart");
      } catch (err) {
        toast.error(err.message || "Error fetching cart");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) return;
    const response = await updateCartItem(itemId, newQty);
    const success = response.data.success;
    const message = response.data.message;
    const data = response.data.data;

    if (success) {
      setCart(data.cart);
    } else {
      toast.error(message || "Error updating item");
    }
  };

  const handleRemoveItem = async (itemId) => {
    const { success, message } = await deleteCartItem(itemId);
    if (success) {
      setCart((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== itemId),
      }));
      toast.success("Item removed");
    } else {
      toast.error(message || "Error removing item");
    }
  };

  const handleClearCart = async () => {
    const { success, message } = await clearCart();
    if (success) {
      setCart((prev) => ({ ...prev, items: [] }));
      toast.success("Cart cleared");
    } else {
      toast.error(message || "Error clearing cart");
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!cart || cart.items.length === 0)
    return <div className="p-4 text-white">Your cart is empty.</div>;
  console.log("cart: ", cart);
  return (
    <div className="max-w-4xl mx-auto p-4 text-white">
      <h2 className="text-2xl font-bold mb-4">My Cart</h2>
      <table className="w-full text-left border border-gray-200">
        <thead>
          <tr>
            <th className="p-2 border">Product</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Subtotal</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cart.items.map((item) => (
            <tr key={item.id}>
              <td className="p-2 border">
                {item.product?.name || "Product not available"}
              </td>
              <td className="p-2 border">
                ${item.product?.price?.toFixed(2) || "0.00"}
              </td>
              <td className="p-2 border">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.id, parseInt(e.target.value))
                  }
                  className="border rounded px-2 py-1 w-16"
                />
              </td>
              <td className="p-2 border">
                ${((item.product?.price || 0) * item.quantity).toFixed(2)}
              </td>
              <td className="p-2 border">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between items-center">
        <p className="text-lg font-bold">
          Total: ${cart.total_price.toFixed(2)}
        </p>
        <button
          onClick={handleClearCart}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}
