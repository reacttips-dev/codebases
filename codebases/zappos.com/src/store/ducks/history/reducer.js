import {
  STORE_LAST_PAGE_WAS_ORDER_CONFIRMATION
} from 'store/ducks/history/types';

const initialState = {
  wasLastPageOrderConfirmation: false
};

export default function history(state = initialState, action = {}) {
  const { type, wasLastPageOrderConfirmation } = action;
  switch (type) {
    case STORE_LAST_PAGE_WAS_ORDER_CONFIRMATION:
      return { ...state, wasLastPageOrderConfirmation };
    default:
      return state;
  }
}
