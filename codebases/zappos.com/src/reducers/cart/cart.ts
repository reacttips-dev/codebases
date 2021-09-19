import {
  CART_CHANGE_FAILURE,
  CART_ERROR,
  CART_IS_LOADING,
  CART_RESET_STATE,
  PIN_IS_VALID,
  RECEIVE_CART_ITEMS,
  RECEIVE_CART_PROMOS,
  RECEIVE_PIN,
  RECEIVE_TRACKING_NUMBER,
  REQUEST_CART_UPDATE,
  SHOW_CART_MODAL,
  UPDATE_CART_COUNT
} from 'constants/reduxActions';
import { AppAction } from 'types/app';
import { CartResponse } from 'types/mafia';
import { EmptyObject } from 'types/utility';

export interface CartState {
  isLoaded: boolean;
  cartObj: CartResponse | EmptyObject;
  cartCount: number | null;
  error: string | null;
  loading?: boolean;
  isModalShowing?: boolean;
  addedStockId?: string;
  pin?: string;
  trackingNumber?: string;
  isValid?: boolean;
  promos?: any; // TODO ts use correct type when landing page is typed
}

const initialState: CartState = {
  isLoaded: false,
  cartObj: {},
  cartCount: null,
  error: null
};

export default function cart(state: Readonly<CartState> = initialState, action: AppAction): CartState {
  switch (action.type) {
    case RECEIVE_CART_ITEMS:
      const { cartObj, cartCount } = action;
      return { ...state, cartObj, cartCount, isLoaded: true, loading: false };
    case RECEIVE_CART_PROMOS:
      const { promos } = action;
      return { ...state, promos };
    case UPDATE_CART_COUNT:
      const { cartCount: updatedCartCount } = action;
      return { ...state, cartCount: updatedCartCount };
    case REQUEST_CART_UPDATE:
      return { ...state, loading: true, error: null };
    case CART_CHANGE_FAILURE:
      return { ...state, loading: false };
    case CART_ERROR:
      const { error } = action;
      return { ...state, error };
    case CART_IS_LOADING:
      return { ...state, loading: true };
    case SHOW_CART_MODAL: {
      const { isShowing, stockId } = action;
      return { ...state, isModalShowing: isShowing, addedStockId: isShowing ? stockId : undefined };
    }
    case RECEIVE_PIN: {
      const { pin } = action;
      return { ...state, pin };
    }
    case PIN_IS_VALID: {
      const { isValid } = action;
      return { ...state, isValid };
    }
    case RECEIVE_TRACKING_NUMBER: {
      const { trackingNumber } = action;
      return { ...state, trackingNumber };
    }
    case CART_RESET_STATE: {
      return initialState;
    }
    default:
      return state;
  }
}
