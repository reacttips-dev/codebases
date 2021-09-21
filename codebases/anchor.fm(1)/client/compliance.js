/**
 * Session-stored.
 * Mostly GDPR-related, site-wide stuff
 */
import { REHYDRATE } from 'redux-persist/constants';
import AnchorAPI from './modules/AnchorAPI';

const SET_GEO_REGION = '@@compliance/SET_GEO_REGION';
const SET_IS_COOKIE_BANNER_DISMISSED =
  '@@compliance/SET_IS_COOKIE_BANNER_DISMISSED';

export const UNKNOWN_GEO_COUNTRY = 'unknownGeoCountry';
export const UNKNOWN_GEO_REGION = 'unknownGeoRegion';

const initialState = {
  geoCountry: null,
  geoRegion: null,
  isSessionRetrieved: false,
  isCookieBannerDismissed: false,
};

// reducer

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE: {
      const { compliance } = action.payload;
      if (compliance) {
        return {
          ...initialState,
          ...compliance,
          isSessionRetrieved: true,
        };
      }
      return {
        ...state,
        isSessionRetrieved: true,
      };
    }
    case SET_IS_COOKIE_BANNER_DISMISSED:
      return {
        ...state,
        isCookieBannerDismissed: action.payload.isCookieBannerDismissed,
      };
    case SET_GEO_REGION:
      return {
        ...state,
        geoCountry: action.payload.geoCountry || UNKNOWN_GEO_COUNTRY,
        geoRegion: action.payload.geoRegion || UNKNOWN_GEO_REGION,
      };
    default:
      return state;
  }
}

// action creators

export function setGeoRegion(regionMetadata) {
  return {
    type: SET_GEO_REGION,
    payload: regionMetadata,
  };
}

export function setIsCookieBannerDismissed(isCookieBannerDismissed) {
  return {
    type: SET_IS_COOKIE_BANNER_DISMISSED,
    payload: { isCookieBannerDismissed },
  };
}

// thunks

export function fetchGeoRegion() {
  return (dispatch, getState) =>
    AnchorAPI.getGeoRegion().then(response => {
      dispatch(setGeoRegion(response));
    });
}
