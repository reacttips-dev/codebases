import {
  CLEAR_REWARDS_SUCCESS,
  RECEIVE_CUSTOMER_IS_BANNED,
  RECEIVE_EASY_FLOW_CONTENT,
  RECEIVE_PRIME_STATUS,
  RECEIVE_REWARDS_ERROR,
  RECEIVE_REWARDS_INFO,
  RECEIVE_REWARDS_TERMS,
  RECEIVE_SIGNUP_FOR_REWARDS,
  RECEIVE_VIP_DASHBOARD_HEADER_CONTENT,
  REDIRECT,
  REQUEST_REDEMPTION_INCREMENTS,
  REQUEST_REWARDS_INFO,
  REQUEST_SIGNUP_FOR_REWARDS,
  RR_CHANGE_REDEEM_AMOUNT,
  RR_COMPONENT_VIEW,
  SET_FEDERATED_LOGIN_MODAL_VISIBILITY
} from 'constants/reduxActions';
import { recordToSplunk } from 'apis/checkout';
import { HF_TOPBANNER_CONTENT_TYPE_REWARDS } from 'constants/rewardsInfo';
import { authenticationErrorCatchHandlerFactory } from 'actions/errors';
import { setSessionCookies } from 'actions/session';
import { setHFTopBannerContent, showHFTopBanner } from 'actions/headerfooter';
import {
  enrollRewards,
  enrollRewardsWithEmailToken,
  getPrimeStatus,
  getRewards,
  getRewardsTerms,
  getSymphonySlots
} from 'apis/mafia';
import {
  ERROR_ALREADY_ENROLLED_IN_REWARDS,
  ERROR_CUSTOMER_IS_BANNED_FROM_REWARDS,
  ERROR_NOT_AUTHENTICATED,
  fetchAllowNotFoundErrorMiddleware,
  fetchApiNotAuthenticatedMiddleware,
  fetchCustomerAleradyEnrolledRewardsMiddleware,
  fetchCustomerIsBannedFromRewardsMiddleware,
  fetchErrorMiddleware
} from 'middleware/fetchErrorMiddleware';
import { prependAppRoot } from 'history/AppRootUtils';
import { processHeadersMiddleware } from 'middleware/processHeadersMiddlewareFactory';
import { trackError } from 'helpers/ErrorUtils';
import marketplace from 'cfg/marketplace.json';

const { account: { vipDashboardUrl } } = marketplace;

export function receiveCustomerIsBanned() {
  return {
    type: RECEIVE_CUSTOMER_IS_BANNED
  };
}

export function requestSignupForRewards() {
  return {
    type: REQUEST_SIGNUP_FOR_REWARDS
  };
}

export function receiveSignupForRewards(resp) {
  return {
    type: RECEIVE_SIGNUP_FOR_REWARDS,
    enrolledSince: resp.unix_timestamp
  };
}

export function requestRewardsInfo() {
  return {
    type: REQUEST_REWARDS_INFO
  };
}

export function receiveRewardsInfo(rewardsInfo) {
  return {
    type: RECEIVE_REWARDS_INFO,
    rewardsInfo: rewardsInfo.data
  };
}

export function receiveRewardsTerms(resp) {
  const { slotData } = resp;
  return {
    type: RECEIVE_REWARDS_TERMS,
    terms: slotData['primary-1']
  };
}

export function receiveRewardsError() {
  return {
    type: RECEIVE_REWARDS_ERROR
  };
}

export function requestRedemptionIncrements() {
  return {
    type: REQUEST_REDEMPTION_INCREMENTS
  };
}

export function clearRewardsSuccess() {
  return {
    type: CLEAR_REWARDS_SUCCESS
  };
}

export function onChangeRedemptionAmountEvent() {
  return {
    type: RR_CHANGE_REDEEM_AMOUNT
  };
}

export function onRedeemRewardsComponentView() {
  return {
    type: RR_COMPONENT_VIEW
  };
}

export function receivePrimeStatus(primeStatus) {
  return {
    type: RECEIVE_PRIME_STATUS,
    primeStatus
  };
}

export function receiveEasyFlowContent(content) {
  return {
    type: RECEIVE_EASY_FLOW_CONTENT,
    content
  };
}

export function receiveVipDashboardHeaderContent(content) {
  return {
    type: RECEIVE_VIP_DASHBOARD_HEADER_CONTENT,
    content
  };
}

export function signupForRewardsFromToken(emailAuthToken) {
  return (dispatch, getState) => {
    dispatch(requestSignupForRewards());
    const { cookies, environmentConfig: { api: { mafia }, akitaKey } } = getState();
    return enrollRewardsWithEmailToken(mafia, akitaKey, cookies, emailAuthToken)
      .then(processHeadersMiddleware(setSessionCookies(dispatch, getState)))
      .then(fetchCustomerIsBannedFromRewardsMiddleware)
      .then(fetchCustomerAleradyEnrolledRewardsMiddleware)
      .then(fetchErrorMiddleware)
      .then(resp => {
        dispatch(receiveSignupForRewards(resp));
        dispatch({ type: REDIRECT, location: '/vip/confirmed' });
      })
      .catch(error => {
        switch (error.id) {
          case ERROR_CUSTOMER_IS_BANNED_FROM_REWARDS:
            dispatch(receiveCustomerIsBanned());
            break;
          case ERROR_ALREADY_ENROLLED_IN_REWARDS:
            dispatch({ type: REDIRECT, location: '/vip/alreadyEnrolled' });
            break;
          case ERROR_NOT_AUTHENTICATED:
            return dispatch({
              type: SET_FEDERATED_LOGIN_MODAL_VISIBILITY,
              payload:  {
                isFederatedLoginModalShowing: true,
                returnTo: vipDashboardUrl
              }
            });
          default:
            trackError('NON-FATAL', 'Customer had error on vip optin', error);
            break;
        }
      });
  };
}

export function signupForRewards(returnTo) {
  return (dispatch, getState) => {
    dispatch(requestSignupForRewards());
    const { cookies, environmentConfig: { api: { mafia }, akitaKey }, routing: { locationBeforeTransitions } } = getState();
    return enrollRewards(mafia, akitaKey, cookies)
      .then(processHeadersMiddleware(setSessionCookies(dispatch, getState)))
      .then(fetchApiNotAuthenticatedMiddleware)
      .then(fetchErrorMiddleware)
      .then(resp => {
        dispatch(receiveSignupForRewards(resp));
        return resp;
      })
      .catch(authenticationErrorCatchHandlerFactory(dispatch, prependAppRoot(returnTo || vipDashboardUrl, locationBeforeTransitions)));
  };
}

export function fetchPrimeStatus() {
  return (dispatch, getState) => {
    const { cookies, environmentConfig: { api: { mafia } } } = getState();
    return getPrimeStatus(mafia, cookies)
      .then(processHeadersMiddleware(setSessionCookies(dispatch, getState)))
      .then(fetchErrorMiddleware)
      .then(resp => {
        dispatch(receivePrimeStatus(resp));
      });
  };
}

export function fetchRewardsInfo(options = {}, getRewardsApi = getRewards) {
  const { returnTo, updateTopBannerData, includesBenefits = false } = options;
  return (dispatch, getState) => {
    dispatch(requestRewardsInfo());
    const { cookies, environmentConfig: { api: { mafia }, akitaKey }, routing: { locationBeforeTransitions } } = getState();
    return getRewardsApi(mafia, akitaKey, includesBenefits, cookies)
      .then(processHeadersMiddleware(setSessionCookies(dispatch, getState)))
      .then(fetchApiNotAuthenticatedMiddleware)
      .then(fetchAllowNotFoundErrorMiddleware)
      .then(resp => {
        const { data, data: { consented } } = resp || { data: { canEnroll: true } };
        if (consented) {
          dispatch(receiveRewardsInfo(resp));
        }

        if (resp) {
          dispatch(showHFTopBanner());
        }

        if (updateTopBannerData && resp) {
          const { tier, points_to_next_tier: pointsToNextTier, spend_points: spendPoints, benefits } = data;
          const bannerContent = { tier, pointsToNextTier, spendPoints, benefits };
          dispatch(setHFTopBannerContent({ bannerType: HF_TOPBANNER_CONTENT_TYPE_REWARDS, bannerContent }));
        }

        if (!consented) {
          const { cookies } = getState();
          getRewardsTerms(mafia, cookies)
            .then(fetchErrorMiddleware)
            .then(pageContent => {
              dispatch(receiveRewardsTerms(pageContent));
              dispatch(receiveRewardsInfo({ data }));
            });
        }

        return data;
      })
      .catch(e => {
        recordToSplunk(`type=getRewardsApi&error=${encodeURIComponent(e.toString())}`);
        if (returnTo) { // given returnTo on vipDashboardUrl page, check for auth and redirect back to dashboard if not logged in
          return authenticationErrorCatchHandlerFactory(dispatch, prependAppRoot(returnTo, locationBeforeTransitions))(e);
        } else { // otherwise, just fail silently (eg. on main /account page)
          dispatch(receiveRewardsError());
          trackError('NON-FATAL', 'Could not load rewards data.', e);
        }
      });
  };
}

export function fetchEasyFlowContent(getEasyFlowContent = getSymphonySlots) {
  return (dispatch, getState) => {
    const state = getState();
    const { environmentConfig: { api: { mafia } }, cookies } = state;
    return getEasyFlowContent(mafia, { pageName: 'vip-prime-link', pageLayout: 'KrsOne' }, cookies)
      .then(fetchErrorMiddleware)
      .then(response => {
        dispatch(receiveEasyFlowContent(response?.slotData));
      })
      .catch(err => {
        trackError('NON-FATAL', 'Failed to fetch Symphony Easy Flow content', err);
      });
  };
}

export function fetchVipDashboardHeaderContent(getVipDashboardHeader = getSymphonySlots) {
  return (dispatch, getState) => {
    const state = getState();
    const { environmentConfig: { api: { mafia } }, cookies } = state;
    return getVipDashboardHeader(mafia, { pageName: 'vip-dash', pageLayout: 'KrsOne' }, cookies)
      .then(fetchErrorMiddleware)
      .then(response => {
        const content = Object.entries(response?.slotData).find(slot => {
          const [ , slotContent ] = slot || [];
          return slotContent?.componentName === 'vipDashboardHeader';
        });

        if (content) {
          dispatch(receiveVipDashboardHeaderContent(content));
        }
      })
      .catch(err => {
        trackError('NON-FATAL', 'Failed to fetch Symphony VIP Dashboad Header content', err);
      });
  };
}
