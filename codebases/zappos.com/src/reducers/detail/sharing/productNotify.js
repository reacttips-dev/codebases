import { RECEIVE_PRODUCT_ALL_SIZES, REQUEST_PRODUCT_DETAIL, SEND_PRODUCT_NOTIFY_SUBSCRIPTION, SEND_PRODUCT_NOTIFY_SUBSCRIPTION_COMPLETE, TOGGLE_BRAND_NOTIFY_MODAL, TOGGLE_PRODUCT_NOTIFY_MODAL } from 'constants/reduxActions';

const initialState = { modalShown: false, brandModalShown: false };

export default function reducer(state = initialState, action) {
  const { type, successful, modalShown, product } = action;
  switch (type) {
    case TOGGLE_PRODUCT_NOTIFY_MODAL:
      const newState = { ...state, modalShown };
      if (!modalShown) {
        newState.sending = false;
        newState.successfullySent = undefined;
      }
      return newState;
    case TOGGLE_BRAND_NOTIFY_MODAL:
      const toggledState = { ...state, brandModalShown: modalShown };
      if (!modalShown) {
        toggledState.sending = false;
        toggledState.successfullySent = undefined;
      }
      return toggledState;
    case SEND_PRODUCT_NOTIFY_SUBSCRIPTION:
      return { ...state, sending: true };
    case SEND_PRODUCT_NOTIFY_SUBSCRIPTION_COMPLETE:
      return { ...state, sending: false, successfullySent: successful };
    case RECEIVE_PRODUCT_ALL_SIZES:
      return { ...state, product };
    case REQUEST_PRODUCT_DETAIL:
      // clear out the loaded product any time a new product is loaded.
      return { ... state, product: undefined };
    default:
      return state;
  }
}
