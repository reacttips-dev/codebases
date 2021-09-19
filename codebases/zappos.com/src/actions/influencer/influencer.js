import queryString from 'query-string';

import { fetchLandingPageInfo } from 'actions/landing/landingPageInfo';
import {
  INFLUENCER_ELIGIBILITY_PAGE,
  INFLUENCER_ENROLL_SUCCESS_PAGE,
  INFLUENCER_HUB_PAGE, INFLUENCER_LANDING_PAGE, INFLUENCER_SIGNUP_PAGE
} from 'constants/influencerPages';
import {
  ENROLL_INFLUENCER_SUCCESS,
  REQUEST_INFLUENCER_DETAILS,
  SET_DOC_META_INFLUENCER_LP,
  SET_INFLUENCER_APP_CONFIG,
  SET_INFLUENCER_DETAILS,
  SET_INFLUENCER_TOKEN,
  SET_IS_INFLUENCER_STATUS
} from 'constants/reduxActions';
import { redirectTo } from 'actions/redirect';
import { track } from 'apis/amethyst';
import { evEnrollInfluencer } from 'events/influencer';
import {
  InfluencerStatus,
  ProfileType
} from 'types/influencer';
import {
  addInfluencerSocialProfile,
  enrollInfluencer,
  getInfluencerAppConfigurations,
  getInfluencerDetails,
  getInfluencerStatus,
  getInfluencerToken,
  updateInfluencerDetails,
  updateInfluencerSocialProfile
} from 'apis/mafia';
import { fetchErrorMiddleware } from 'middleware/fetchErrorMiddleware';

export function enrollSuccess(response) {
  track(() => ([evEnrollInfluencer, {}]));
  return {
    type: ENROLL_INFLUENCER_SUCCESS,
    response
  };
}

export function setIsInfluencer(response) {
  return {
    type: SET_IS_INFLUENCER_STATUS,
    status: response.status
  };
}

export function setAppConfiguration(response) {
  return {
    type: SET_INFLUENCER_APP_CONFIG,
    appConfig: response
  };
}

export function setInfluencerDetails(response) {
  return {
    type: SET_INFLUENCER_DETAILS,
    influencerDetails: response
  };
}

export function requestInfluencerDetails() {
  return { type: REQUEST_INFLUENCER_DETAILS };
}

export function setInfluencerToken(response) {
  return {
    type: SET_INFLUENCER_TOKEN,
    influencerToken: response.shareToken
  };
}

export function handleEnrollInfluencer(requestBody) {
  return (dispatch, getState) => {
    const { cookies, environmentConfig: { api: { mafia } } } = getState();
    const isCustomer = 'x-main' in cookies;
    if (!isCustomer) {
      return dispatch(redirectTo(INFLUENCER_SIGNUP_PAGE));
    }
    return getInfluencerStatus(mafia, cookies).then(fetchErrorMiddleware).then(response => {
      if (response.status !== null) {
        return dispatch(redirectTo(INFLUENCER_ELIGIBILITY_PAGE));
      }
      return enrollInfluencer(mafia, { data:requestBody }, cookies)
        .then(fetchErrorMiddleware).then(response => {
          const path = response.status === 'Success' ? INFLUENCER_ELIGIBILITY_PAGE : INFLUENCER_SIGNUP_PAGE;
          dispatch(enrollSuccess(response));
          dispatch(redirectTo(path));
        });
    });
  };
}

export function handleGetInfluencerStatus() {
  return (dispatch, getState) => {
    const { cookies, environmentConfig: { api: { mafia } } } = getState();
    return getInfluencerStatus(mafia, cookies).then(fetchErrorMiddleware).then(response => {
      dispatch(setIsInfluencer(response));
    });
  };
}

export function handleGetInfluencerAppsConfig() {
  return (dispatch, getState) => {
    const { cookies, environmentConfig: { api: { mafia } } } = getState();
    return getInfluencerAppConfigurations(mafia, cookies).then(fetchErrorMiddleware).then(response => {
      dispatch(setAppConfiguration(response));
    });
  };
}

export function handleGetInfluencerDetails() {
  return (dispatch, getState) => {
    const { cookies, environmentConfig: { api: { mafia } } } = getState();
    return getInfluencerDetails(mafia, cookies).then(fetchErrorMiddleware).then(response => {
      dispatch(setInfluencerDetails(response));
    });
  };
}

export function handleGetInfluencerToken() {
  return (dispatch, getState) => {
    const { cookies, environmentConfig: { api: { mafia } } } = getState();
    const isCustomer = 'x-main' in cookies;
    if (!isCustomer) {
      return ;
    }
    return getInfluencerStatus(mafia, cookies).then(fetchErrorMiddleware).then(response => {
      dispatch(setIsInfluencer(response));
      if (response.status === InfluencerStatus.ACTIVE) {
        return getInfluencerToken(mafia, null, cookies).then(fetchErrorMiddleware).then(response => dispatch(setInfluencerToken(response)));
      }
    });
  };
}

export function handleProfileCallback(searchParams) {
  return (dispatch, getState) => {
    const { cookies, environmentConfig: { api: { mafia } } } = getState();
    return getInfluencerStatus(mafia, cookies).then(fetchErrorMiddleware).then(response => {
      const queryParams = queryString.parse(searchParams) || {};
      const isFirstEnrolled = response.status !== InfluencerStatus.ACTIVE;
      const { error, code, state } = queryParams || {};
      if (error) {
        dispatch(redirectTo(INFLUENCER_ELIGIBILITY_PAGE));
      }
      if (code && state) {
        const stateVal = state.toUpperCase();
        const profileType = ProfileType[stateVal] || '';
        const oAuthCode = code;
        if (oAuthCode && profileType) {
          const requestBody = {
            oAuthCode: oAuthCode,
            profileType
          };
          dispatch(handleAddSocialProfile(requestBody, isFirstEnrolled));
        }
      }
    });
  };
}

export function handleAddSocialProfile(requestBody, isFirstEnroll) {
  return (dispatch, getState) => {
    const { cookies, environmentConfig: { api: { mafia } } } = getState();
    return addInfluencerSocialProfile(mafia, { data:requestBody }, cookies)
      .then(fetchErrorMiddleware)
      .then(response => {
        if (response.status === 'Done') {
          const redirectUrl = isFirstEnroll ? INFLUENCER_ENROLL_SUCCESS_PAGE : INFLUENCER_HUB_PAGE;
          dispatch(handleGetInfluencerDetails());
          dispatch(redirectTo(redirectUrl));
        } else {
          const redirectUrl = isFirstEnroll ? INFLUENCER_ELIGIBILITY_PAGE : INFLUENCER_HUB_PAGE;
          dispatch(redirectTo(redirectUrl));
        }
      });
  };
}

export function handleUpdateSocialProfile(requestBody) {
  return (_dispatch, getState) => {
    const { cookies, environmentConfig: { api: { mafia } } } = getState();
    return updateInfluencerSocialProfile(mafia, { data:requestBody }, cookies).then(fetchErrorMiddleware);
  };
}

export function handleUpdateInfluencerDetails(requestBody) {
  return (dispatch, getState) => {
    const { cookies, environmentConfig: { api: { mafia } } } = getState();
    return updateInfluencerDetails(mafia, { data:requestBody }, cookies)
      .then(fetchErrorMiddleware).then(response => {
        if (response.status === 'Success') {
          dispatch(handleGetInfluencerDetails());
          dispatch(redirectTo(INFLUENCER_HUB_PAGE));
        }
      });
  };
}

export function fetchIsInfluencer() {
  return function(dispatch, getState) {
    const { influencer } = getState();

    if (influencer.status === InfluencerStatus.UNKNOWN) {
      return dispatch(handleGetInfluencerStatus());
    }
  };
}

export function fetchInfluencerAppConfig() {
  return function(dispatch, getState) {
    const { influencer } = getState();
    if (!influencer.appConfig) {
      return dispatch(handleGetInfluencerAppsConfig());
    }
  };
}

function handleRedirectForNonNullStatus(mafia, cookies, dispatch, isLoading) {
  return getInfluencerDetails(mafia, cookies).then(fetchErrorMiddleware).then(response => {
    dispatch(setInfluencerDetails(response));
    const {
      details: {
        status,
        socialMediaProfiles,
        name
      }
    } = response;
    if (status !== InfluencerStatus.UNKNOWN && !isLoading) {
      switch (status) {
        case InfluencerStatus.ACTIVE:
          return (name === null)
            ? dispatch(redirectTo(INFLUENCER_ENROLL_SUCCESS_PAGE))
            : dispatch(redirectTo(INFLUENCER_HUB_PAGE));
        case InfluencerStatus.PENDING: {
          return Object.keys(socialMediaProfiles).length === 0 && dispatch(redirectTo(INFLUENCER_ELIGIBILITY_PAGE));
        }
        default:
          return dispatch(redirectTo(INFLUENCER_LANDING_PAGE));
      }
    }
  });
}

export function redirectBasedOnInfluencerDetails() {
  return (dispatch, getState) => {
    const { cookies, environmentConfig: { api: { mafia } }, influencer: { isLoading } } = getState();

    return getInfluencerStatus(mafia, cookies).then(fetchErrorMiddleware).then(response => {
      if (response.status === null) {
        dispatch(setIsInfluencer(response));
        return dispatch(redirectTo(INFLUENCER_LANDING_PAGE));
      } else {
        return handleRedirectForNonNullStatus(mafia, cookies, dispatch, isLoading);
      }
    });

  };
}

export function loadInfluencerLandingPage(pageName) {
  return function(dispatch, getState) {
    return dispatch(fetchLandingPageInfo(pageName))
      .then(() => {
        const { landingPage: { pageName, pageInfo } } = getState();
        if (pageInfo) {
          dispatch(loadedLandingPage(pageName, pageInfo));
        }
      });
  };
}

export function loadedLandingPage(pageName, pageInfo) {
  return {
    type: SET_DOC_META_INFLUENCER_LP,
    pageName,
    pageInfo
  };
}
