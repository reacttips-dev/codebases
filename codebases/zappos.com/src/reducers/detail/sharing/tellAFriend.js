import { RECEIVE_TELL_A_FRIEND_CAPTCHA, RESET_TELL_A_FRIEND, SEND_TELL_A_FRIEND, SEND_TELL_A_FRIEND_COMPLETE, TELL_A_FREND_INVALID_CAPTCHA } from 'constants/reduxActions';

export default function reducer(state = {}, action) {
  const { type, successful, captcha } = action;
  switch (type) {
    case SEND_TELL_A_FRIEND:
      return { ...state, sending: true };
    case SEND_TELL_A_FRIEND_COMPLETE:
      return { ...state, sending: false, successfullySent: successful, captcha: { ...state.captcha, invalid: false } };
    case RECEIVE_TELL_A_FRIEND_CAPTCHA:
      return { ...state, captcha: { ...captcha, invalid: state.captcha && state.captcha.invalid } };
    case TELL_A_FREND_INVALID_CAPTCHA:
      return { ...state, sending: false, captcha: { ...state.captcha, invalid: true } };
    case RESET_TELL_A_FRIEND:
      return {};
  }
  return state;
}
