// src/redux/cart/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchCartItemsAPI,
  addToCartAPI,
  updateCartAPI,
  deleteCartItemAPI,
  clearCartAPI
} from './cartAPI';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchCartItems = createAsyncThunk(
  'cart/fetchItems',
  async (userInfo) => await fetchCartItemsAPI(userInfo)
);

export const addToCart = createAsyncThunk(
  'cart/addItem',
  async (data) => await addToCartAPI(data)
);

export const updateCart = createAsyncThunk(
  'cart/updateItem',
  async (data) => await updateCartAPI(data)
);

export const deleteCartItem = createAsyncThunk(
  'cart/deleteItem',
  async (Item) => {
    await deleteCartItemAPI(Item);
    return Item;
  }
);

export const clearCart = createAsyncThunk(
  'cart/clear',
  async (user) => {
    await clearCartAPI(user);
    return [];
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    emptyCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(addToCart.fulfilled, (state, action) => {
        state.items.push(action.meta.arg); // assuming arg is the item added
      })

      .addCase(updateCart.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.basket_id === action.meta.arg.basket_id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.meta.arg };
        }
      })

      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.basket_id !== action.payload);
      })

      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      });
  }
});

export const { emptyCart } = cartSlice.actions;
export default cartSlice.reducer;
