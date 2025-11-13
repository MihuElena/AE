// client/src/store/slices/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchCart as fetchCartApi,
  addToCart as addToCartApi,
  updateCartItem as updateCartItemApi,
  deleteCartItem as deleteCartItemApi,
  clearCart as clearCartApi,
} from '../../api/cart.routes'

// GET CART
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, thunkAPI) => {
    const res = await fetchCartApi()
    if (!res?.success) {
      return thunkAPI.rejectWithValue(res?.message || 'Error fetching cart')
    }
    return res.data
  }
)

// ADD TO CART
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1 }, thunkAPI) => {
    const res = await addToCartApi(productId, quantity)
    if (!res?.success) {
      return thunkAPI.rejectWithValue(res?.message || 'Error adding to cart')
    }
    thunkAPI.dispatch(fetchCart())
    return res.data
  }
)

// UPDATE CART ITEM
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ id, quantity }, thunkAPI) => {
    const res = await updateCartItemApi(id, quantity)
    if (!res?.success) {
      return thunkAPI.rejectWithValue(res?.message || 'Error updating cart item')
    }
    thunkAPI.dispatch(fetchCart())
    return res.data
  }
)

// DELETE ITEM
export const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem',
  async (id, thunkAPI) => {
    const res = await deleteCartItemApi(id)
    if (!res?.success) {
      return thunkAPI.rejectWithValue(res?.message || 'Error deleting item')
    }
    thunkAPI.dispatch(fetchCart())
    return id
  }
)

// CLEAR CART
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, thunkAPI) => {
    const res = await clearCartApi()
    if (!res?.success) {
      return thunkAPI.rejectWithValue(res?.message || 'Error clearing cart')
    }
    return true
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload || []
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = []
      })
  },
})

export default cartSlice.reducer
