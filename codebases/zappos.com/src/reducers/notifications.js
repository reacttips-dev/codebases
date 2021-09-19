import {
  CAN_RECEIVE_PUSH,
  SAVE_PUSH_ENDPOINT,
  SAVE_PUSH_TOPICS,
  TOGGLE_PUSH_OVERLAY
} from 'constants/reduxActions';

export default function notifications(state = { allowed: false, showOverlay: false, subscriptions: {} }, action) {
  const { type, subscriptions } = action;
  switch (type) {
    case CAN_RECEIVE_PUSH:
      return { ...state, allowed: true };
    case TOGGLE_PUSH_OVERLAY:
      return { ...state, showOverlay: !state.showOverlay };
    case SAVE_PUSH_TOPICS:
      const newSubscriptions = {};
      subscriptions.forEach(v => {
        newSubscriptions[v.topic] = v;
      });
      return { ...state, subscriptions: Object.assign({}, state.subscriptions, newSubscriptions) };
    case SAVE_PUSH_ENDPOINT:
      return { ...state, endpoint: subscriptions };
    default:
      return state;
  }
}
