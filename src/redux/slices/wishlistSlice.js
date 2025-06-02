// src/redux/cart/wishlistSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchWishlistItemsAPI,
  addToWishlistAPI,
  updateWishlistAPI,
  deleteWishlistItemAPI,
  clearWishlistAPI
} from './wishlistAPI';

const initialState = {
  wishitems: [],
  status: 'idle',
  error: null,
};

export const fetchWishlistItems = createAsyncThunk(
  'wishlist/fetchItems',
  async (userInfo) => await fetchWishlistItemsAPI(userInfo)
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addItem',
  async (data) => await addToWishlistAPI(data)
);

export const updateWishlist = createAsyncThunk(
  'wishlist/updateItem',
  async (data) => await updateWishlistAPI(data)
);

export const deleteWishlistItem = createAsyncThunk(
  'wishlist/deleteItem',
  async (Item) => {
    await deleteWishlistItemAPI(Item);
    return Item;
  }
);

export const clearWishlist = createAsyncThunk(
  'wishlist/clear',
  async (user) => {
    await clearWishlistAPI(user);
    return [];
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    emptyWishlist: (state) => {
      state.wishitems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlistItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWishlistItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.wishitems = action.payload;
      })
      .addCase(fetchWishlistItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.wishitems.push(action.meta.arg); // assuming arg is the item added
      })

      .addCase(updateWishlist.fulfilled, (state, action) => {
        const index = state.wishitems.findIndex(item => item.wish_list_id === action.meta.arg.wish_list_id);
        if (index !== -1) {
          state.wishitems[index] = { ...state.wishitems[index], ...action.meta.arg };
        }
      })

      .addCase(deleteWishlistItem.fulfilled, (state, action) => {
        state.wishitems = state.wishitems.filter(item => item.wish_list_id !== action.payload);
      })

      .addCase(clearWishlist.fulfilled, (state) => {
        state.wishitems = [];
      });
  }
});

export const { emptyWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
