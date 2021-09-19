import { RECEIVE_CUSTOMER_AUTH_DETAILS } from 'constants/reduxActions';

// This reducer holds a tri-value of state: definitely authenticated (true), definitely not authenticated (false), and unknown authentication status (null)
export default function reducer(state = null, { type, authObj }) {
  if (type === RECEIVE_CUSTOMER_AUTH_DETAILS) {
    return !!(authObj && authObj.success);
  }
  return state;
}
