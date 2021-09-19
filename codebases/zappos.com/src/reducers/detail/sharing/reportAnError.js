import {
  RECEIVE_REPORT_AN_ERROR_CAPTCHA,
  REPORT_AN_ERROR_INVALID_CAPTCHA,
  RESET_REPORT_AN_ERROR,
  SEND_REPORT_AN_ERROR,
  SEND_REPORT_AN_ERROR_COMPLETE,
  TOGGLE_REPORT_AN_ERROR_MODAL
} from 'constants/reduxActions';
import { GRAY_PLACEHOLDER_PIXEL } from 'constants/appConstants';

const captchaPlaceholder = { url: GRAY_PLACEHOLDER_PIXEL, height: 70, width: 200, token: '' };
const initialState = { modalShown: false, captcha: captchaPlaceholder };

export default function reducer(state = initialState, action) {
  const { captcha, type, successful, modalShown } = action;
  switch (type) {
    case TOGGLE_REPORT_AN_ERROR_MODAL:
      const newState = { ...state, modalShown };
      if (!modalShown) {
        newState.sending = false;
        newState.successfullySent = undefined;
      }
      return newState;
    case SEND_REPORT_AN_ERROR:
      return { ...state, sending: true };
    case SEND_REPORT_AN_ERROR_COMPLETE:
      return { ...state, sending: false, successfullySent: successful, captcha: { ...state.captcha, invalid: false } };
    case RECEIVE_REPORT_AN_ERROR_CAPTCHA:
      return { ...state, captcha: { ...captcha, invalid: state.captcha && state.captcha.invalid } };
    case REPORT_AN_ERROR_INVALID_CAPTCHA:
      return { ...state, sending: false, captcha: { ...state.captcha, invalid: true } };
    case RESET_REPORT_AN_ERROR:
      return initialState;
    default:
      return state;
  }
}
