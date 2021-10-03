import {
  WEBSOCKET_OPEN,
  WEBSOCKET_CLOSED,
  WEBSOCKET_MESSAGE,
  TOAST_MESSAGE,
  CLOSE_TOAST,
} from "../_actions/types";

const initialState = {
  connected: false,
  host: null,
  details: null,
  snapshot: false,
  toasts: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case WEBSOCKET_OPEN:
      return {
        ...state,
        host: action.host,
        connected: true,
        details: "Connected",
      };
    case WEBSOCKET_CLOSED:
      return {
        ...state,
        connected: false,
        details: "Disconnected.",
      };
    case WEBSOCKET_MESSAGE:
      return {
        ...state,
        details: action.payload.message,
        snapshot: action.payload.snapshot,
      };
    case TOAST_MESSAGE:
      return {
        ...state,
        toasts: [
          ...state.toasts,
          {
            toastMessage: action.payload.message,
            toastHeading: action.payload.heading,
            toastType: action.payload.type,
            autohide: action.payload?.autohide,
            key: action.payload?.key || Math.random(),
          },
        ],
      };
    case CLOSE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter(
          (toast, index) => toast?.key !== action.payload?.key
        ),
      };
    default:
      return state;
  }
}
