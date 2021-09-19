import {
  SERIALIZE_STATE,
  STORE_ZFC_SESSION_ID
} from 'constants/reduxActions';

export default function zfcSessionId(state = '', action) {
  const { type, zfcSessionId = '' } = action;

  switch (type) {
    case SERIALIZE_STATE:
      return '';
    case STORE_ZFC_SESSION_ID:
      return zfcSessionId;
    default:
      return state;
  }
}
