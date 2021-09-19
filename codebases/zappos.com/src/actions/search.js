import { SEARCH_PAGE } from 'constants/amethystPageTypes';
import {
  ADD_ON_SALE,
  CLEAR_SAVED_FILTERS,
  CLEAR_SEARCH_INLINE_RECOS,
  FEEDBACK_CLICK,
  RECEIVE_SEARCH_INLINE_RECOS,
  RECEIVE_SEARCH_RECOS,
  SET_URL_UPDATED,
  TOGGLE_FACETS,
  TOGGLE_SAVED_FILTERS,
  UPDATE_BEST_FOR_YOU,
  UPDATE_SAVED_FILTERS,
  UPDATE_SEARCH_LAYOUT,
  UPDATE_SORT
} from 'constants/reduxActions';
import {
  NEVER_EXPIRE_COOKIE_TIME,
  SEARCH_LAYOUT_COOKIE
} from 'constants/cookies';
import { getJanusRecos } from 'apis/mafia';
import marketplace from 'cfg/marketplace.json';
import { setAndStoreCookie } from 'actions/session';

const {
  api: { mafia }
} = marketplace;

export function searchFeedbackClick(feedback) {
  return {
    type: FEEDBACK_CLICK,
    feedback,
    pageType: SEARCH_PAGE,
    feedbackType: 'SEARCH_RELEVANCY_FEEDBACK'
  };
}

export function toggleFacetsContainer(visible) {
  return {
    type: TOGGLE_FACETS,
    visible: visible
  };
}

export function updateSort(sort) {
  return {
    type: UPDATE_SORT,
    sort
  };
}

export function setUrlUpdated() {
  return {
    type: SET_URL_UPDATED
  };
}

export function addOnSale() {
  return {
    type: ADD_ON_SALE
  };
}

export function addNoResultsRecos(response, imageHost) {
  return {
    type: RECEIVE_SEARCH_RECOS,
    response,
    imageHost
  };
}

export function addInlineRecos(response, imageHost) {
  return {
    type: RECEIVE_SEARCH_INLINE_RECOS,
    response,
    imageHost
  };
}

export function clearInlineRecos() {
  return {
    type: CLEAR_SEARCH_INLINE_RECOS
  };
}

export function updateBestForYou(response) {
  return {
    type: UPDATE_BEST_FOR_YOU,
    response
  };
}

export function toggleSavedFilters() {
  return {
    type: TOGGLE_SAVED_FILTERS
  };
}

export function updateSavedFilters(response, oldFilters) {
  return {
    type: UPDATE_SAVED_FILTERS,
    response,
    oldFilters
  };
}

export function clearSavedFilters() {
  return {
    type: CLEAR_SAVED_FILTERS
  };
}

export function fetchSearchRecos(term, janusFetcher = getJanusRecos) {
  return (dispatch, getState) => {
    const state = getState();
    const { cookies } = state;
    return janusFetcher(mafia, { params: { txt: term, limit_0: 12 }, widgets: 'zap_no_res', limit: 5, credentials: cookies, dispatch, getState })
      .then(resp => {
        if (resp && resp['zap_no_res']) {
          dispatch(addNoResultsRecos(resp['zap_no_res'], state.environmentConfig.imageServer.url));
        }
      });
  };
}

export function removeDupeRecos(recos, products) {
  const cleanRecos = { ...recos };
  const recosToExclude = [];
  const topResultLimit = Math.min(15, (products || []).length);
  // Only check top search results for dupes (max of 15)
  for (let i = 0; i < topResultLimit; ++i) {
    const product = products[i];
    recosToExclude.push(product.productId + '-' + product.styleId);
  }
  // Filter out the dupes
  const newSims = [];
  cleanRecos.sims = recos.sims.filter(reco => {
    const recoStyle = reco.logical_id + '-' + reco.item_id;
    if (recosToExclude.indexOf(recoStyle) < 0) {
      newSims.push(reco);
    }
  });
  cleanRecos.sims = newSims;
  return cleanRecos;
}

export function fetchSearchInlineRecos(term, janusFetcher = getJanusRecos) {
  return (dispatch, getState) => {
    if (term) {
      const state = getState();
      const { cookies } = state;
      const params = { txt: term };
      const limit = 10;
      return janusFetcher(mafia, { params, widgets: 'search-1', limit, credentials: cookies, dispatch, getState })
        .then(resp => {
          if (resp && resp['search-1'] && resp['search-1'].sims) {
          // Filter dupe products from recos that are already shown in search results
            const cleanedRecos = removeDupeRecos(resp['search-1'], state.products.list);
            dispatch(addInlineRecos(cleanedRecos, state.environmentConfig.imageServer.url));
          }
        });
    }
  };
}

export function updateSearchLayout(layout) {
  return dispatch => {
    dispatch(setAndStoreCookie(SEARCH_LAYOUT_COOKIE, layout, new Date(NEVER_EXPIRE_COOKIE_TIME)));
    dispatch({ type: UPDATE_SEARCH_LAYOUT, layout });
  };
}
