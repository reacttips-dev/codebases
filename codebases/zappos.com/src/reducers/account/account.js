import {
  RECEIVE_ACCOUNT_CONTENT,
  RECEIVE_ACCOUNT_INFO,
  RECEIVE_AD_PREFERENCE_ERROR,
  RECEIVE_AD_PREFERENCES,
  RECEIVE_GIFT_CARD_BALANCE,
  RECEIVE_REDEEM_GIFT_CARD_FAILURE,
  RECEIVE_REDEEM_GIFT_CARD_SUCCESS,
  REMOVE_ITEM_FOR_CANCELLATION_OR_RETURN,
  REQUEST_ACCOUNT_INFO,
  REQUEST_GIFT_CARD_BALANCE,
  REQUEST_REDEEM_GIFT_CARD,
  RESET_CANCEL_OR_RETURN_ITEMS,
  RESTORE_ACCOUNT_STATE,
  SELECT_ITEM_FOR_CANCELLATION_OR_RETURN,
  SET_ITEM_NOTIFICATION,
  SET_PREVIOUS_ORDER_ACTION,
  UPDATE_GIFT_CARD_REDEEM_CODE
} from 'constants/reduxActions';
import { ORDER_ACTION_NONE } from 'constants/orderActions';

const initialState = {
  customerInfo: null,
  giftCardBalance: null,
  giftCardRedeemCode: '',
  giftCardRedeemError: '',
  isGiftCardRedeemed: false,
  isGiftCardRedeemLoading: false,
  cancelOrReturnItems: [],
  isLoading: false,
  previousOrderAction: ORDER_ACTION_NONE
};

export default function accountInfo(state = initialState, action) {
  const {
    type,
    customerInfo,
    giftCardBalance,
    giftCardRedeemCode,
    giftCardRedeemError,
    id,
    err,
    ads,
    item,
    content,
    previousOrderAction,
    previousAccountState
  } = action;

  switch (type) {
    case REQUEST_ACCOUNT_INFO:
      return { ...state, isLoading: true };
    case RECEIVE_ACCOUNT_INFO:
      return { ...state, customerInfo, isLoading: false };
    case REQUEST_GIFT_CARD_BALANCE:
      return { ...state, isLoading: true };
    case RECEIVE_GIFT_CARD_BALANCE:
      return { ...state, giftCardBalance, isLoading: false };
    case REQUEST_REDEEM_GIFT_CARD:
      return { ...state, isGiftCardRedeemLoading: true };
    case RECEIVE_ACCOUNT_CONTENT:
      return { ...state, content };
    case RECEIVE_REDEEM_GIFT_CARD_SUCCESS:
      return { ...state, giftCardBalance, giftCardRedeemCode: '', isGiftCardRedeemed: true, isGiftCardRedeemLoading: false };
    case RECEIVE_REDEEM_GIFT_CARD_FAILURE:
      return { ...state, giftCardRedeemError, isGiftCardRedeemLoading: false };
    case UPDATE_GIFT_CARD_REDEEM_CODE:
      return { ...state, giftCardRedeemCode, giftCardRedeemError: '', isGiftCardRedeemed: false };
    case RECEIVE_AD_PREFERENCES:
      return { ...state, ads: { ...ads, err: false } };
    case RECEIVE_AD_PREFERENCE_ERROR:
      return { ...state, ads: { err } };
    case SET_ITEM_NOTIFICATION:
      const oosItems = state.oosMessages || [];
      if (!oosItems.includes(id)) {
        const oosMessages = oosItems.concat([id]);
        return { ...state, oosMessages };
      }
      break;
    case SELECT_ITEM_FOR_CANCELLATION_OR_RETURN:
      if (state.cancelOrReturnItems.find(orderItem => orderItem.itemUniqueId === item.itemUniqueId)) {
        return { ...state };
      }
      const newItems = state.cancelOrReturnItems.concat(item);
      return { ...state, cancelOrReturnItems: newItems };
    case REMOVE_ITEM_FOR_CANCELLATION_OR_RETURN:
      return { ...state, cancelOrReturnItems: state.cancelOrReturnItems.filter(orderItem => orderItem.itemUniqueId !== item.itemUniqueId) };
    case RESET_CANCEL_OR_RETURN_ITEMS:
      return { ...state, cancelOrReturnItems: [] };
    case SET_PREVIOUS_ORDER_ACTION:
      return { ...state, previousOrderAction };
    case RESTORE_ACCOUNT_STATE:
      return { ...previousAccountState };
    default:
      return state;
  }
}
