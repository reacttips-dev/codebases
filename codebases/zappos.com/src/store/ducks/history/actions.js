import {
  STORE_LAST_PAGE_WAS_ORDER_CONFIRMATION
} from 'store/ducks/history/types';

export const setLastPageWasOrderconfirmation = wasLastPageOrderConfirmation => ({ type: STORE_LAST_PAGE_WAS_ORDER_CONFIRMATION, wasLastPageOrderConfirmation });
