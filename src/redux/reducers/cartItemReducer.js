import {
    FETCH_CART_DATA_REQUEST,
    FETCH_CART_DATA_SUCCESS,
    FETCH_CART_DATA_FAILURE,
    INSERT_CART_DATA_REQUEST,
    INSERT_CART_DATA_SUCCESS,
    INSERT_CART_DATA_FAILURE,
    UPDATE_CART_DATA_REQUEST,
    UPDATE_CART_DATA_SUCCESS,
    UPDATE_CART_DATA_FAILURE,
    REMOVE_CART_DATA_REQUEST,
    REMOVE_CART_DATA_SUCCESS,
    REMOVE_CART_DATA_FAILURE,
    CLEAR_CART_DATA_REQUEST,
    CLEAR_CART_DATA_SUCCESS,
    CLEAR_CART_DATA_FAILURE,
    EMPTY_CART_DATA_SUCCESS,
    EMPTY_CART_DATA_FAILURE,
  } from '../actions/cartItemActions';
  
  const initialState = {
    loading: false,
    cartItems: [],
    error: null,
  };
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      // Handle all REQUEST actions
      case FETCH_CART_DATA_REQUEST:
      case INSERT_CART_DATA_REQUEST:
      case UPDATE_CART_DATA_REQUEST:
      case REMOVE_CART_DATA_REQUEST:
      case CLEAR_CART_DATA_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
  
      // Fetch cart data
      case FETCH_CART_DATA_SUCCESS:
        return {
          ...state,
          loading: false,
          cartItems: action.payload,
          error: null,
        };
      case FETCH_CART_DATA_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
  
        case EMPTY_CART_DATA_SUCCESS:
          return {
            ...state,
            loading: false,
            cartItems: [],
            error: null,
          };
        case EMPTY_CART_DATA_FAILURE:
          return {
            ...state,
            loading: false,
            error: action.payload,
          };
  
      // Insert cart data
      case INSERT_CART_DATA_SUCCESS:
        return {
          ...state,
          loading: false,
          cartItems: [...state.cartItems, action.payload],
          error: null,
        };
      case INSERT_CART_DATA_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
  
      // Update cart data
      case UPDATE_CART_DATA_SUCCESS:
        return {
            
          ...state,
          loading: false,
          cartItems: state.cartItems.map((item) =>
            item.basket_id === action.payload.basket_id
              ? { ...item, qty: action.payload.qty }
              : item
          ),
          error: null,
        };
      case UPDATE_CART_DATA_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
  
      // Remove cart data
      case REMOVE_CART_DATA_SUCCESS:
        return {
          ...state,
          loading: false,
          cartItems: state.cartItems.filter(
            (item) => item.basket_id !== action.payload.basket_id
          ),
          error: null,
        };
      case REMOVE_CART_DATA_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
  
      // Clear cart data
      case CLEAR_CART_DATA_SUCCESS:
        return {
          ...state,
          loading: false,
          cartItems: [],
          error: null,
        };
      case CLEAR_CART_DATA_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
  
      // Default case
      default:
        return state;
    }
  };
  
  export default reducer;
  