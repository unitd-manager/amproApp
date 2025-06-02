// src/redux/cart/cartAPI.js
import api from "../../constants/api";


export const fetchWishlistItemsAPI = async (userInfo) => {
  const res = await api.post('/contact/getFavByContactId',{contact_id:userInfo.contact_id});
  console.log('wishlistitems',res.data);
  return res.data.data.map(item => ({ ...item, images: String(item.images).split(',') }));
};

// export const addToWishlistAPI = async (data) => {
//   console.log('addtowish',data);
//   const res = await api.post('/contact/insertToWishlist', data);
//   console.log('addedwish',res.data);
//   return res.data;
// };
export const addToWishlistAPI = async (data) => {
  try {
    console.log('Sending to addToWishlistAPI:', data);
    const res = await api.post('/contact/insertToWishlist', data);
    console.log('addedwish', res.data);
    return res.data;
  } catch (error) {
    console.error('addToWishlistAPI ERROR:', error);
    throw error; // rethrow if you want to handle it outside
  }
};


export const updateWishlistAPI = async (data) => {
  const res = await api.post("/contact/update-cart", data);
  return res.data;
};

export const deleteWishlistItemAPI = async (Item) => {
  console.log('del wish',Item);
  const res = await api.post("/contact/deleteWishlistItem", { wish_list_id: Item.wish_list_id })
  return res.data;
};

export const clearWishlistAPI = async (user) => {
  const res = await api
  .post("/contact/clearWishlistItems", { contact_id: user.contact_id });
  return res.data;
};
