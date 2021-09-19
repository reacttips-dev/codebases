import { RECEIVE_BRAND_NOTIFY_CONFIRMATION } from 'constants/reduxActions';

export default function brandPage(state = {
  isLoaded: false,
  notifyEmail: {
    isValid: null,
    emailAddress: null,
    submitted: false
  }
}, action) {
  const { type } = action;

  switch (type) {
    case RECEIVE_BRAND_NOTIFY_CONFIRMATION:
      return Object.assign({}, state, {
        notifyEmail: {
          isValid: true,
          submitted: true
        }
      });

    default:
      return state;
  }
}
