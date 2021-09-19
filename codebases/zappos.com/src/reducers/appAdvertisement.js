import { DID_SHOW_BANNER } from 'constants/reduxActions';

export default function appAdvertisement(state = { isShowing: false }, action) {
  const { type, isShowing } = action;

  switch (type) {
    case DID_SHOW_BANNER:
      return { ...state, isShowing };
    default:
      return state;
  }
}
