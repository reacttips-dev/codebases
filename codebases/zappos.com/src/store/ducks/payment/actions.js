import {
  CLEAR_PAYMENT_FORM_ERRORS,
  CLEAR_PAYMENT_FORM_ITEM,
  SET_HAS_VERIFY_CC_ERROR,
  SET_PAYMENT_FORM_ITEM
} from 'store/ducks/payment/types';

export const clearPaymentErrors = () => ({ type: CLEAR_PAYMENT_FORM_ERRORS });
export const clearPaymentFormItem = () => ({ type: CLEAR_PAYMENT_FORM_ITEM });
export const setPaymentFormItem = item => ({ type: SET_PAYMENT_FORM_ITEM, payload: item });
export const setHasVerifyCreditCardError = hasVerifyCreditCardError => ({ type: SET_HAS_VERIFY_CC_ERROR, hasVerifyCreditCardError });
