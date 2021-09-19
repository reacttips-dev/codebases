import {
  BLACKLISTED_SEARCH,
  RECEIVE_LANDING_PAGE_INFO,
  RECEIVE_ROUTE_DETAILS,
  RECEIVE_SEARCH_RESPONSE,
  RECEIVE_TAXONOMY_BRAND_PAGE_INFO,
  REQUEST_ROUTE_DETAILS,
  SERIALIZE_STATE,
  SET_REQUEST_INFORMATION
} from 'constants/reduxActions';
import { looksLikeSeoUrl, seoTermToHumanTerm } from 'helpers/SeoUtils';

const URL_PARAMS_ONLY_RE = /\?.*$/;

const initialState = {
  term: null,
  routeDetails: {}
};

export default function wildCard(state = initialState, action) {
  const { type, term, routeDetails, downstreamUrl, pageName, brandId, pageInfo } = action;

  switch (type) {
    case SET_REQUEST_INFORMATION:
      const downstreamUrlNoParams = downstreamUrl.replace(URL_PARAMS_ONLY_RE, '');
      if (looksLikeSeoUrl(downstreamUrlNoParams)) {
        return {
          term: seoTermToHumanTerm(downstreamUrlNoParams.replace('/', '')),
          wildcardWaiting: true
        };
      }
      return state;
    case RECEIVE_SEARCH_RESPONSE:
      if (state.wildcardWaiting) {
        return {
          ...state,
          routeDetails: { type: 'search' },
          wildcardWaiting: false
        };
      }
      return state;
    case RECEIVE_LANDING_PAGE_INFO:
      if (state.wildcardWaiting) {
        return {
          ...state,
          routeDetails: {
            page_name: pageName,
            type: 'landing'
          },
          wildcardWaiting: false
        };
      }
      return state;
    case RECEIVE_TAXONOMY_BRAND_PAGE_INFO:
      if (state.wildcardWaiting) {
        return {
          ...state,
          routeDetails: {
            page_info: pageInfo,
            brand_id: brandId,
            type: 'brand'
          },
          wildcardWaiting: false
        };
      }
      return state;
    case SERIALIZE_STATE:
      if (state.wildcardWaiting) { // only want this to work in server
        return { wildcardWaiting: false };
      }
      return state;
    case REQUEST_ROUTE_DETAILS:
      return state.term === term
        ? state
        : { ...initialState, term };
    case RECEIVE_ROUTE_DETAILS:
      return { ...state, term, routeDetails };
    case BLACKLISTED_SEARCH:
      return {
        ...state,
        routeDetails: { type: 'search' },
        term,
        wildcardWaiting: false
      };
    default:
      return state;
  }
}
