import {
  DELETE_EXPLICIT_FIT,
  RECEIVE_EXPLICIT_FIT,
  RECEIVE_EXPLICIT_FITS,
  SEND_FITSURVEY_REPLY,
  SEND_NEWSFEED_DISMISSAL,
  SEND_NEWSFEED_IMPRESSION,
  SET_RANDOM_NEWSFEED_WIDGET
} from 'constants/reduxActions';

export default function newsfeed(state = { isLoaded: false, randomWidget: {}, fits: [] }, action) {
  const { type, data, fits, fit, id } = action;

  switch (type) {
    case RECEIVE_EXPLICIT_FITS:
      return { ...state, ...fits };
    case RECEIVE_EXPLICIT_FIT:
      return { ...state, fits: [fit, ...state.fits] };
    case DELETE_EXPLICIT_FIT:
      return { ...state, fits: state.fits.filter(fit => fit.id !== id) };
    case SET_RANDOM_NEWSFEED_WIDGET:
      return Object.assign({}, state, { isLoaded: true, randomWidget: data });
    case SEND_NEWSFEED_IMPRESSION:
      return Object.assign({}, state, { isLoaded: true });
    case SEND_FITSURVEY_REPLY:
      return Object.assign({}, state);
    case SEND_NEWSFEED_DISMISSAL:
      return Object.assign({}, state);
    default:
      return state;
  }
}
