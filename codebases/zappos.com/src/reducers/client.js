import {
  BLACKLISTED_SEARCH,
  SERIALIZE_STATE,
  SET_ASK_HMD_SURVEY_DATA,
  SET_ERROR,
  SET_HF_REMOTE,
  SET_RESPONSE_STATUS
} from 'constants/reduxActions';

// It may look like this reducer actually doesn't do anything, but it is initialized directly server side in makeApp#createStore
export default function client(state = {}, action) {
  switch (action.type) {
    case SERIALIZE_STATE:
      return { ...state, request: null };
    case SET_ERROR:
    case SET_RESPONSE_STATUS:
      if (action.statusCode) {
        return { ...state, statusCode: action.statusCode };
      }
      return state;
    case SET_ASK_HMD_SURVEY_DATA:
      if (!action.data) {
        return { ...state, statusCode: 404 };
      }
      return state;
    case SET_HF_REMOTE:
      return { ...state, statusCode: 200 }; // HF API calls don't have an explicit match in react router so we use this to prevent returning 404
    case BLACKLISTED_SEARCH:
      return { ...state, statusCode: 410 };
    default:
      return state;
  }
}
