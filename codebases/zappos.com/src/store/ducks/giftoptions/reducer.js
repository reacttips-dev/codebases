import { hasInvalidGiftOptionsFromConstraintArray } from 'helpers/CheckoutUtils';
import { CONFIGURE_CHECKOUT_SUCCESS } from 'store/ducks/checkout/types';
import {
  GET_GIFT_OPTIONS_SUCCESS,
  REQUEST_GIFT_OPTIONS,
  SET_GIFT_OPTIONS_SAVING
} from 'store/ducks/giftoptions/types';

const defaultState = {
  giftOptions: {},
  isLoading: false,
  isLoaded: false
};

export default function giftOptions(state = defaultState, action = {}) {
  const {
    type,
    payload,
    isRemovingGiftOptions
  } = action;

  switch (type) {
    case CONFIGURE_CHECKOUT_SUCCESS: {
      const { purchaseStatus: { constraintViolations, productList } } = payload;
      const hasGiftOptionCV = hasInvalidGiftOptionsFromConstraintArray(constraintViolations);
      const { isSavingGiftOptions, isRemovingGiftOptions } = state;
      const hasOnlyGiftMessagableItems = productList.every(item => item.giftMessagable);
      const giftMessage = productList.find(item => item.giftMessage)?.giftMessage || '';

      const params = {
        hasOnlyGiftMessagableItems,
        hasInvalidGiftOptions: hasGiftOptionCV,
        giftMessage,
        isLoading: false,
        isSavingGiftOptions: false,
        giftOptionSuccessMessage: ''
      };

      if (isSavingGiftOptions && !hasGiftOptionCV) {
        params.giftOptionSuccessMessage = isRemovingGiftOptions ? 'Gift message has been removed' : 'Gift message has been saved';
      }

      return { ...state, ...params };
    }

    case SET_GIFT_OPTIONS_SAVING: {
      return { ...state, isLoading: true, isSavingGiftOptions: true, isRemovingGiftOptions };
    }

    case REQUEST_GIFT_OPTIONS: {
      return { ...state, isLoading: true };
    }

    case GET_GIFT_OPTIONS_SUCCESS: {
      const { giftOptions } = payload;
      return { ...state, giftOptions, isLoaded: true, isLoading: false };
    }

    default: {
      return state;
    }
  }
}
