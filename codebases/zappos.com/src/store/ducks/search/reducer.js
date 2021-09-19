import appendQuery from 'append-query';

import {
  BEGIN_FETCH_SYMPHONY_SEARCH_COMPONENTS,
  FETCH_SYMPHONY_SEARCH_COMPONENTS_ERROR,
  RECEIVE_SYMPHONY_SEARCH_COMPONENTS
} from 'store/ducks/search/types';
import { crossSiteSellingUniqueIdentifier } from 'helpers/SearchUtils';
import marketplace from 'cfg/marketplace.json';

const { crossSiteDomains, crossSiteQsParam, domain } = marketplace;

const initialState = {
  error: null,
  isLoadingSymphony: false,
  symphony: {}
};

export const formatCrossSiteComponentParams = (data, term) => {
  data.slotData = Object.entries(data.slotData).reduce((acc, [key, value]) => {
    const isCrossSiteDomainLink = crossSiteDomains.some(crossSiteDomain => value?.link?.toLowerCase().includes(crossSiteDomain));
    if (isCrossSiteDomainLink) {
      value.link = appendQuery(value.link, {
        'utm_medium': 'p2p',
        'utm_campaign': `${domain}_redirect`,
        'utm_term': term,
        [crossSiteQsParam]: crossSiteSellingUniqueIdentifier
      });
      value.crossSiteSellingUniqueIdentifier = crossSiteSellingUniqueIdentifier;
    }
    acc[key] = value;
    return acc;
  }, {});
  return data;
};

export default function searchReducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case BEGIN_FETCH_SYMPHONY_SEARCH_COMPONENTS:
      return { ...state, isLoadingSymphony: true };
    case RECEIVE_SYMPHONY_SEARCH_COMPONENTS:
      return {
        ...state,
        isLoadingSymphony: false,
        symphony: formatCrossSiteComponentParams(payload.data, payload.term)
      };
    case FETCH_SYMPHONY_SEARCH_COMPONENTS_ERROR:
      return { ...state, isLoadingSymphony: false, error: payload.error };
    default:
      return state;
  }
}
