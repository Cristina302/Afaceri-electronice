import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: []  // array de produse din cart
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity } = action.payload
      const existing = state.items.find((item) => item.id === product.id)
      if (existing) {
        existing.quantity += quantity
      } else {
        state.items.push({ ...product, quantity })
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer
