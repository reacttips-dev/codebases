import {
  CANCEL_ORDER_HISTORY_SEARCH,
  ERROR_ORDER_HISTORY_SEARCH,
  RECEIVE_ORDER_HISTORY_SEARCH,
  RECEIVE_ORDERS,
  REQUEST_ORDER_HISTORY_SEARCH,
  REQUEST_ORDERS
} from 'constants/reduxActions';
import { injectUniqueIdsToLineItems } from 'helpers/MyAccountUtils';
import { Order } from 'types/mafia';
import { AppAction } from 'types/app';

export interface OrdersState {
  orders: Order[] | null;
  totalPages: number | null;
  isLoading: boolean;
  searchOrdersError: boolean;
}

const initialState: OrdersState = {
  orders: null,
  totalPages: null,
  isLoading: false,
  searchOrdersError: false
};

export default function orders(state = initialState, action: AppAction): OrdersState {
  switch (action.type) {
    case REQUEST_ORDERS:
      return { ...state, isLoading: true };

    case RECEIVE_ORDER_HISTORY_SEARCH:
    case RECEIVE_ORDERS:
      const { orders, totalPages } = action;
      const newOrders = orders.map(order => ({
        ...order,
        lineItems: injectUniqueIdsToLineItems(order)
      }));
      return { ...state, totalPages, orders: newOrders, isLoading: false };

    case REQUEST_ORDER_HISTORY_SEARCH:
      return { ...state, isLoading: true, searchOrdersError: false };

    case CANCEL_ORDER_HISTORY_SEARCH:
      return { ...state, searchOrdersError: false };

    case ERROR_ORDER_HISTORY_SEARCH:
      return { ...state, searchOrdersError: true, isLoading: false };

    default:
      return state;
  }
}
