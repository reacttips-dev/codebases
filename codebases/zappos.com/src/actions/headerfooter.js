import debounce from 'lodash.debounce';

import {
  DISMISS_GLOBAL_BANNER,
  RECEIVE_REMOTE_HF_CONTENT,
  SET_FEDERATED_LOGIN_MODAL_VISIBILITY,
  SET_FOOTER_HISTORY_RECOS,
  SET_GLOBAL_BANNER_DATA,
  SET_HF_DATA,
  SET_HF_FOOT_SUBSCRIBE_ERROR,
  SET_HF_FOOT_SUBSCRIBE_SUBMIT,
  SET_HF_MOBILE_BREAKPOINT,
  SET_HF_SEARCH_SUGGEST,
  SET_HF_SEARCH_SUGGEST_ACTIVE_INDEX,
  SET_HF_SEARCH_TERM,
  SET_HF_SIGN_UP_MODAL,
  SET_HF_TOPBANNER_DATA,
  SHOW_HF_TOP_BANNER,
  TOGGLE_HF,
  TOGGLE_MOBILE_HEADER_EXPAND,
  TYPED_SEARCH
} from 'constants/reduxActions';
import {
  EXPIRE_IMMEDIATE_COOKIE_TIME,
  NEWLY_REGISTERED_COOKIE,
  OPAL_PROFILE_COOKIE
} from 'constants/cookies';
import { HF_TOPBANNER_CONTENT_TYPE_REWARDS } from 'constants/rewardsInfo';
import {
  DISMISSED_GLOBAL_BANNER_SESSION_STORAGE_KEY,
  SHAMELESS_PLUG_LIST_ID
} from 'constants/appConstants';
import { trackError } from 'helpers/ErrorUtils';
import { fetchErrorMiddleware, fetchErrorMiddlewareMaybeJson } from 'middleware/fetchErrorMiddleware';
import { trackEvent } from 'helpers/analytics';
import { loadFromLocalStorage, saveToLocalStorage } from 'helpers/localStorageUtilities';
import { getSubsiteId, isForceRefreshed } from 'helpers/ClientUtils';
import { fetchRewardsInfo } from 'actions/account/rewards';
import { isMobileContentBreakpoint } from 'helpers/HtmlHelpers';
import { loadProductDetailPage } from 'actions/productDetail';
import { setAndStoreCookie } from 'actions/session';
import { PRODUCT_ASIN } from 'common/regex';
import { stripSpecialCharsConsolidateWhitespace } from 'helpers';
import {
  cartCount,
  enrollRewards,
  getZcsSlot,
  recommendationsSearch,
  subscribeToList,
  subscribeToListZSub,
  subscribeToMarketingList,
  subscribeToMarketingListZSub
} from 'apis/mafia';
import { profile } from 'apis/opal';
import { searchAutoComplete } from 'apis/calypso';
import { changeCartCount } from 'actions/cart';
import ProductUtils from 'helpers/ProductUtils';
import marketplace from 'cfg/marketplace.json';
import { HYDRA_SUBSCRIPTION_TEST } from 'constants/hydraTests';
import { isAssigned } from 'actions/ab';

const { siteId, search: { autoCompleteCategories }, features: { showSigninIncentive } } = marketplace;

const SEARCH_SUGGEST_DEBOUNCE = 200;

export function typedSearch() {
  return {
    type: TYPED_SEARCH
  };
}

export function searchByTerm({ term, facet }, router, { forceRefreshTypedSearch, asinFetcher } = { forceRefreshTypedSearch: isForceRefreshed(marketplace, 'typedSearch'), asinFetcher: loadProductDetailPage }) {
  return dispatch => {
    function typedSearchPush(url, forcedRouterMethod) {
      if (!router) {// For when remotely consumed HFs can't client route
        window.location = url;
      } else if (forcedRouterMethod && router[forcedRouterMethod]) {
        router[forcedRouterMethod](url);
      } else if (forceRefreshTypedSearch) {
        router.forceRefreshPush(url);
      } else {
        router.push(url);
      }
    }

    dispatch(typedSearch());
    setHFSearchSuggestionsActiveIndex(null);
    const possibleAsin = term.toUpperCase().trim();
    const encodedTerm = encodeURIComponent(term);
    // If searching by ASIN
    if (possibleAsin.match(PRODUCT_ASIN)) {
      return dispatch(asinFetcher({ asin: possibleAsin }, { errorOnOos: false, background: true })).then(product => {
        const productUrl = ProductUtils.getProductUrlFromAsin(product, possibleAsin);
        if (productUrl) {
          // going to a product
          typedSearchPush(productUrl, 'pushPreserveAppRoot');
        } else {
          typedSearchPush(`/search?term=${encodedTerm}`);
        }
      }).catch(() => {
        // If the asin lookup fails, there is not much we can do except to just perform a search
        typedSearchPush(`/search?term=${encodedTerm}`);
      });
    } else {
      if (facet) {
        typedSearchPush(`/search/${encodedTerm}/filter/${facet}`);
      } else {
        typedSearchPush(`/search?term=${encodedTerm}`);
      }
    }
    return Promise.resolve();
  };
}

export function fetchRewardsInfoForTopBanner() {
  return (dispatch, getState) => {
    const appState = getState();
    const { cookies } = appState;
    const isUserRecognized = !!cookies['x-main'];

    if (isUserRecognized) {
      dispatch(fetchRewardsInfo({ updateTopBannerData: true }));
      // Don't show the top banner until we get the rewards info from the server.
    } else if (showSigninIncentive) {
      // User is not recognized.  Let's mark the rewards content as empty, so that
      // the reducer picks a generic top banner phrase instead (e.g. 'You are awesome!' or 'You should log in!')
      dispatch(showHFTopBanner());
      dispatch(setHFTopBannerContent({ bannerType: HF_TOPBANNER_CONTENT_TYPE_REWARDS, bannerContent: {}, showSigninIncentive }));
    }
  };
}

export function getCartCount(getCall = cartCount) {
  return (dispatch, getState) => {
    const state = getState();
    const {
      cookies, environmentConfig: { api: { mafia } }
    } = state;
    return getCall(mafia, cookies)
      .then(fetchErrorMiddleware)
      .then(data => dispatch(changeCartCount(data?.totalCartItems || 0)))
      .catch(err => {
        trackError('NON-FATAL', 'Could not retrieve cart count', err);
        dispatch(changeCartCount(0));
      });
  };
}

export function setHFContent(data) {
  return {
    type: SET_HF_DATA,
    data
  };
}

export function setHFTopBannerContent({ bannerType, bannerContent, showSigninIncentive }) {
  return {
    type: SET_HF_TOPBANNER_DATA,
    bannerType,
    bannerContent,
    showSigninIncentive
  };
}

export function showHFTopBanner() {
  return {
    type: SHOW_HF_TOP_BANNER
  };
}

export function setHFBreakpoint(isMobile) {
  return {
    type: SET_HF_MOBILE_BREAKPOINT,
    isMobile
  };
}

export function setHeaderFooterVisibility(isHfVisible) {
  return {
    type: TOGGLE_HF,
    isHfVisible
  };
}

export function setRemoteHFContent(remoteHfContent) {
  return {
    type: RECEIVE_REMOTE_HF_CONTENT,
    remoteHf: remoteHfContent
  };
}

export function checkForHFBreakpoint(checkBreakpoint = isMobileContentBreakpoint) {
  return (dispatch, getState) => {
    const { headerFooter: { isMobile } } = getState();
    const header = document.querySelector('[data-header-container]');
    const currentIsMobile = header ? checkBreakpoint(header) : false;
    if (isMobile !== currentIsMobile) {
      dispatch(setHFBreakpoint(currentIsMobile));
    }
  };
}

// Main search term & autocomplete shtufff
export function setHFSearchTerm(term) {
  return {
    type: SET_HF_SEARCH_TERM,
    term
  };
}

export function resetHFSearchSuggestions() {
  return dispatch => {
    dispatch(setHFSearchSuggestionsActiveIndex());
    dispatch(setHFSearchSuggestions());
  };
}

export function setHFSearchSuggestions(suggestions = []) {
  return {
    type: SET_HF_SEARCH_SUGGEST,
    suggestions
  };
}

export function setHFSearchSuggestionsActiveIndex(suggestionIndex = null) {
  return {
    type: SET_HF_SEARCH_SUGGEST_ACTIVE_INDEX,
    suggestionIndex
  };
}

/**
 * Call for Search Sugesstions
 * @param {object} calypso          calypso config
 * @param {string} term             term to autocomplete on
 * @param  {bool}   categories      show/hide categories
 * @param autoCompleteFetch                   api fetcher  function
 * @return {object}                           promise
 */
export function autoComplete(calypso, term, categories, autoCompleteFetch = searchAutoComplete) {
  return autoCompleteFetch(calypso, { term, categories })
    .then(fetchErrorMiddleware);
}

// Stole this debounce setup from https://gist.github.com/krstffr/245fe83885b597aabaf06348220c2fe9
export const callSearchSuggest = debounce((dispatch, calypso, term, autoComp = autoComplete) => autoComp(calypso, stripSpecialCharsConsolidateWhitespace(term), autoCompleteCategories)
  .then(data => {
    // data nested inside `matches` array for categories=true calls
    const suggestions = data.matches || data;
    if (suggestions) {
      dispatch(setHFSearchSuggestions(suggestions));
    } else {
      dispatch(resetHFSearchSuggestions());
    }
  })
  .catch(err => {
    trackError('NON-FATAL', `Could not call search suggestions for term: ${term}`, err);
  }), SEARCH_SUGGEST_DEBOUNCE);

export function handleHFSearchChange(e, autoComp = autoComplete) {
  const term = e.target.value;
  return (dispatch, getState) => {
    const appState = getState();
    dispatch(setHFSearchSuggestionsActiveIndex(null));
    dispatch(setHFSearchTerm(term));
    if (term) {
      const { environmentConfig: { api: { calypso } } } = appState;
      callSearchSuggest(dispatch, calypso, term, autoComp);
    } else {
      // clear search suggest
      dispatch(setHFSearchSuggestions());
    }
  };
}

export function setFooterSubscribeSubmitted(isFooterSubscribeSubmitted) {
  return {
    type: SET_HF_FOOT_SUBSCRIBE_SUBMIT,
    isFooterSubscribeSubmitted
  };
}

export function setFooterSubscribeError(hasFooterSubscribeError) {
  return {
    type: SET_HF_FOOT_SUBSCRIBE_ERROR,
    hasFooterSubscribeError
  };
}

// Footer email newsletter submit
export function handleSubscribeSubmit(emailAddress) {
  return (dispatch, getState) => {
    const state = getState();
    const { cookies, environmentConfig: { api: { mafia } } } = state;

    const hydraNewSubscriptionService = isAssigned(HYDRA_SUBSCRIPTION_TEST, 1, state);
    const subscribe = hydraNewSubscriptionService ? subscribeToListZSub : subscribeToList;

    const subsiteId = getSubsiteId(marketplace);
    trackEvent('TE_FOOTER_SUBSCRIBE');
    return subscribe(mafia, {
      siteId,
      subsiteId,
      listIds: [SHAMELESS_PLUG_LIST_ID],
      emailAddress
    }, cookies)
      .then(fetchErrorMiddlewareMaybeJson)
      .then(() => {
        dispatch(setFooterSubscribeSubmitted(true));
      })
      .catch(err => {
        dispatch(setFooterSubscribeError(true));
        trackError('ERROR', 'Footer newsletter subscribe failure', err);
      });
  };
}

export function setFooterHistoryRecos(footerRecos) {
  return {
    type: SET_FOOTER_HISTORY_RECOS,
    footerRecos
  };
}

export function getFooterHistoryRecos(getRecos = recommendationsSearch) {
  return (dispatch, getState) => {
    const { cookies, environmentConfig: { api: { mafia } } } = getState();
    if (cookies['x-main']) {
      return getRecos(mafia, cookies)
        .then(fetchErrorMiddleware)
        .then(data => {
          if (data['zap-hp-vh']) {
            const { recoName, recs } = data['zap-hp-vh'];
            // Create sensible link for href with reftag
            if (recs?.length) {
              recs.forEach((v, i) => {
                data['zap-hp-vh'].recs[i].link = `/product/${v.item_id}?ref=${recoName}`;
              });
              dispatch(setFooterHistoryRecos(data['zap-hp-vh']));
            }
          }
        })
        .catch(err => {
          trackError('ERROR', 'Failed to fetch footer recently viewed', err);
        });
    }
  };
}

export function setSignUpModal(isSignUpModalOpen) {
  trackEvent('TE_FOOTER_SIGN_UP_MODAL_SUBMIT', 'close');
  return {
    type: SET_HF_SIGN_UP_MODAL,
    isSignUpModalOpen
  };
}

export function initSignUpModal() {
  return dispatch => {
    dispatch(setAndStoreCookie(NEWLY_REGISTERED_COOKIE, '', new Date(EXPIRE_IMMEDIATE_COOKIE_TIME)));
    dispatch(setSignUpModal(true));
  };
}

function subscribeEmail(mafia, credentials, hydraNewSubscriptionService) {
  const subscribe = hydraNewSubscriptionService ? subscribeToMarketingListZSub : subscribeToMarketingList;
  return subscribe(mafia, { topic: 'GENERAL_NEWS' }, credentials)
    .then(fetchErrorMiddlewareMaybeJson)
    .then(() => {
      trackEvent('TE_FOOTER_SIGN_UP_MODAL_SUBMIT', 'email');
    })
    .catch(err => {
      trackError('ERROR', 'Failed to subscribe to marketing email list via sign up modal', err);
    });
}

function subscribeRewards(mafia, akitaKey, cookies) {
  return enrollRewards(mafia, akitaKey, cookies)
    .then(fetchErrorMiddleware)
    .then(() => {
      trackEvent('TE_FOOTER_SIGN_UP_MODAL_SUBMIT', 'rewards');
    })
    .catch(err => {
      trackError('ERROR', 'Failed to subscribe to rewards via sign up modal', err);
    });
}

export function handleSignUpModalSubmit(e, subEmail = subscribeEmail, subRewards = subscribeRewards) {
  e.preventDefault();
  const emailChecked = e.target['email'] ? e.target['email'].checked : false;
  const rewardsChecked = e.target['rewards'] ? e.target['rewards'].checked : false;
  return (dispatch, getState) => {
    trackEvent('TE_FOOTER_SIGN_UP_MODAL_SUBMIT');
    const state = getState();
    const { cookies, environmentConfig: { api: { mafia }, akitaKey } } = state;
    const hydraNewSubscriptionService = isAssigned(HYDRA_SUBSCRIPTION_TEST, 1, state);

    dispatch(setSignUpModal(false));
    if (emailChecked) {
      subEmail(mafia, cookies, hydraNewSubscriptionService);
    }
    if (rewardsChecked) {
      subRewards(mafia, akitaKey, cookies);
    }
  };
}

export function getProfile(profileCall = profile) {
  return (dispatch, getState) => {
    const { environmentConfig: { api: { opal } } } = getState();
    let cacheControl;
    return profileCall(opal)
      .then(res => {
        if (res.ok || res.status === 404) {// 404s are expected for unknown/new customers
          cacheControl = res.headers.get('Cache-Control');
          return res.json();
        } else {
          throw new Error('Failed fetch call');
        }
      })
      .then(json => {
        // Get expiration value from cache control header
        // Get number value from response which is in seconds. Default to one day(86400000).
        const cacheControlInt = cacheControl ? parseInt(cacheControl.replace(/\D/g, ''), 10) * 1000 : 86400000;
        const expiry = new Date(Date.now() + cacheControlInt);

        let data;
        if (json.error) {
          data = { searchProfile: { valid: false } };
        } else {
          data = { searchProfile: { ...json, valid: true } };
        }
        dispatch(setAndStoreCookie(OPAL_PROFILE_COOKIE, JSON.stringify(data), expiry));
      })
      .catch(err => {
        trackError('NON-FATAL', 'Search Profile Error:', err);
      });
  };
}

export function handleSearchKeyDown(e) {
  const { keyCode } = e;
  return (dispatch, getState) => {
    const { headerFooter: { suggestions, suggestionIndex } } = getState();
    const isNull = suggestionIndex === null;
    const curEl = document.activeElement;

    // If we're focused on search input
    if (curEl === document.getElementById('searchAll')) {
      switch (keyCode) {
        case 40:// Key down
          e.preventDefault();
          if (suggestionIndex === suggestions.length - 1) {
            dispatch(setHFSearchSuggestionsActiveIndex(null));
          } else {
            dispatch(setHFSearchSuggestionsActiveIndex(!isNull ? suggestionIndex + 1 : 0));
          }
          break;
        case 38:// Key up
          e.preventDefault();
          if (suggestionIndex === 0) {
            dispatch(setHFSearchSuggestionsActiveIndex(null));
          } else {
            dispatch(setHFSearchSuggestionsActiveIndex(!isNull ? suggestionIndex - 1 : suggestions.length - 1));
          }
          break;
        case 27:// Escape
          dispatch(setHFSearchSuggestionsActiveIndex(null));
      }
    }
  };
}

export const toggleMobileHeaderExpand = () => ({
  type: TOGGLE_MOBILE_HEADER_EXPAND
});

export const setFederatedLoginModalVisibility = (isVisible, options = {}) => ({
  type: SET_FEDERATED_LOGIN_MODAL_VISIBILITY,
  payload: {
    isFederatedLoginModalShowing: isVisible,
    returnTo: options.returnTo,
    redirectOnClose: options.redirectOnClose,
    sourcePageType: options.sourcePageType
  }
});

export const getZapposGlobalBannerData = (getData = getZcsSlot) => (dispatch, getState) => {
  const { environmentConfig: { api: { mafia } }, cookies } = getState();
  return getData(mafia, cookies, { pageLayout: 'Header', pageName: 'zapposheader', slotName: 'bottom-banner' })
    .then(fetchErrorMiddleware)
    .then(data => {
      const dismissedBanners = loadFromLocalStorage(DISMISSED_GLOBAL_BANNER_SESSION_STORAGE_KEY) || [];
      if (data && !dismissedBanners.includes(data.gae)) {
        dispatch({
          type: SET_GLOBAL_BANNER_DATA,
          data
        });
      }
    })
    .catch(err => trackError('NON-FATAL', 'Global bottom banner:', err));
};

export const dismissGlobalBanner = id => {
  const dismissedBanners = loadFromLocalStorage(DISMISSED_GLOBAL_BANNER_SESSION_STORAGE_KEY) || [];
  saveToLocalStorage(DISMISSED_GLOBAL_BANNER_SESSION_STORAGE_KEY, [ ...dismissedBanners, id]);
  return {
    type: DISMISS_GLOBAL_BANNER
  };
};
