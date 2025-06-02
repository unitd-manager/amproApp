// src/redux/cart/cartAPI.js
import api from "../../constants/api";


export const fetchCartItemsAPI = async (userInfo) => {
  const res = await api.post('/contact/getCartProductsByContactId',{contact_id:userInfo.contact_id});
  return res.data.data.map(item => ({ ...item, images: String(item.images).split(',') }));
};

export const addToCartAPI = async (data) => {
  const res = await api.post('/contact/addToCart', data);
  return res.data;
};

export const updateCartAPI = async (data) => {
  const res = await api.post("/contact/update-cart", data);
  return res.data;
};

export const deleteCartItemAPI = async (Item) => {
  const res = await api
  .post("/contact/deleteCartItem", { basket_id: Item.basket_id })
  return res.data;
};

export const clearCartAPI = async (user) => {
  const res = await api
  .post("/contact/clearCartItems", { contact_id: user.contact_id });
  return res.data;
};
