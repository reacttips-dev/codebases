import {
  LOAD_PIXEL_SERVER,
  SET_SHOULD_FIRE_ORDER_CONFIRMATION_PIXEL
} from 'constants/reduxActions';

export default function pixelServerReducer(state = {}, action) {
  const { data, pageType, queryString, shouldFireOnOrderConfirmation, type } = action;
  switch (type) {
    case LOAD_PIXEL_SERVER:
      return {
        data,
        pageType,
        queryString
      };
    case SET_SHOULD_FIRE_ORDER_CONFIRMATION_PIXEL: {
      return { ...state, shouldFireOnOrderConfirmation };
    }
    default:
      return state;
  }
}
