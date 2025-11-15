import axiosAuth from "../axios/axiosAuth";

/* ---------------------------------------------
   🛒 CART
---------------------------------------------- */

// Get the authenticated user's cart
export const getMyCart = async () => {
  try {
    const response = await axiosAuth.get("cart");
    return response.data;
  } catch (error) {
    console.error("Error getting cart:", error);
    return error.response?.data;
  }
};

// Add a product to cart
export const addProductToCart = async (productId, quantity = 1) => {
    try {
        const data = {"productId": productId, "quantity": quantity}
        const response = await axiosAuth.post("cart/add", data);
    return response.data;
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return error.response?.data;
  }
};

// Update a cart item (quantity)
export const updateCartItem = async (itemId, quantity) => {
    try {
      console.log("trimit put")
      
        const response = await axiosAuth.put(`cart/item/${itemId}`, { quantity });
      console.log(response);
        
    return response;
  } catch (error) {
    console.error("Error updating cart item:", error);
    return error.response?.data;
  }
};

// Remove a product from cart
export const deleteCartItem = async (itemId) => {
  try {
    const response = await axiosAuth.delete(`cart/item/${itemId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return error.response?.data;
  }
};

// Clear the entire cart
export const clearCart = async () => {
  try {
    const response = await axiosAuth.delete("cart/clear");
    return response.data;
  } catch (error) {
    console.error("Error clearing cart:", error);
    return error.response?.data;
  }
};
