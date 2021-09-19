import {
  EXCHANGE_GET_ORDER_ID_SUCCESS,
  EXCHANGE_SET_INIT_EXCHANGE_DATA,
  EXCHANGE_SET_NEW_ITEM_ASIN,
  EXCHANGE_SET_PRODUCT_BUNDLE_INFO,
  EXCHANGE_SUBMIT_COMPLETE,
  EXCHANGE_SUBMIT_ERROR,
  EXCHANGE_SUBMIT_INITIATE,
  RECEIVE_POST_EXCHANGE_INFO,
  RECEIVE_PRE_EXCHANGE_INFO,
  SET_IS_EXCHANGE_ERROR_MESSAGE_DISPLAY
} from 'constants/reduxActions';

const initialState = {
  preExchangeInfo: {},
  postExchangeInfo: {},
  isExchangeSubmitting: false,
  labelInfo: {},
  isExchangeError: false,
  productBundleResponse: {},
  asinSelectedForExchange: null,
  isInitExchangeDataReady: false,
  isExchangeErrorMessageDisplay: false
};

export default function exchange(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_PRE_EXCHANGE_INFO:
      return {
        ...state,
        preExchangeInfo: action.payload
      };
    case EXCHANGE_SUBMIT_INITIATE:
      return {
        ...state,
        isExchangeSubmitting: true,
        isExchangeError: false,
        postExchangeInfo: {},
        contractSummary: {}
      };
    case EXCHANGE_SUBMIT_ERROR:
      return {
        ...state,
        isExchangeSubmitting: false,
        isExchangeError: true
      };
    case EXCHANGE_SUBMIT_COMPLETE:
      return {
        ...state,
        isExchangeSubmitting: false,
        isExchangeError: false
      };
    case RECEIVE_POST_EXCHANGE_INFO:
      return {
        ...state,
        postExchangeInfo: action.payload
      };
    case EXCHANGE_SET_NEW_ITEM_ASIN:
      return {
        ...state,
        asinSelectedForExchange: action.payload
      };
    case EXCHANGE_SET_PRODUCT_BUNDLE_INFO:
      return {
        ...state,
        productBundleResponse: action.payload
      };
    case EXCHANGE_SET_INIT_EXCHANGE_DATA:
      return {
        ...state,
        isInitExchangeDataReady: action.payload
      };
    case EXCHANGE_GET_ORDER_ID_SUCCESS:
      return {
        ...state,
        contractSummary: action.payload
      };
    case SET_IS_EXCHANGE_ERROR_MESSAGE_DISPLAY:
      return {
        ...state,
        isExchangeErrorMessageDisplay: action.payload
      };
    default:
      return state;
  }
}
