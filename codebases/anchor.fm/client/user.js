import Promise from 'bluebird';
import queryString from 'query-string';
import { push } from 'react-router-redux';
import { VALID_USER_EMAIL_REGEX } from 'anchor-server-common/utilities/user/constants';
import { ANCHOR_CLIENT_OPTIMIZELY_USER_ID } from 'anchor-server-common/utilities/sharedRequestHeaders';

import { windowUndefined } from 'helpers/serverRenderingUtils';
import { onLogOut, trackEvent } from './modules/analytics';
import { AnchorAPI } from './modules/AnchorAPI';
import { localStorage } from './modules/Browser/localStorage';
import { IS_EXISTING_USER_KEY } from './screens/NewEpisodeRedirectScreen';
import { RECEIVE_PODCAST_METADATA } from './podcastEditorActionNames';

// constants
const MINIMUM_PASSWORD_CHARACTER_COUNT = 7;

export const EMAIL_ERROR_MESSAGE = 'A valid email address is required.';
export const EXISTING_EMAIL_ERROR_MESSAGE = 'Existing email found';
export const EXISTING_ACCOUNT_ERROR_MESSAGE = 'Existing account found';
export const FRIENDLY_ERROR_MESSAGE =
  'Sorry, but we were unable to create your account. Please visit us at https://help.anchor.fm and we’ll help you troubleshoot.';
export const NAME_ERROR_MESSAGE = 'A name is required.';
export const PASSWORD_ERROR_MESSAGE = 'Passwords must be 7 characters or more.';
export const BIRTHDATE_ERROR_MESSAGE =
  'Sorry, you don’t meet Anchor’s age requirements.';

const SET_USER = '@@user/SET_USER';
const UNSET_USER = '@@user/UNSET_USER';
const SHOW_CREATE_ACCOUNT = '@@user/SHOW_CREATE_ACCOUNT';
const SHOW_LOGIN = '@@user/SHOW_LOGIN';
const SHOW_REQUEST_RESET_PASSWORD = '@@user/SHOW_REQUEST_RESET_PASSWORD';
const SHOW_REQUEST_RESET_PASSWORD_CONFIRMATION =
  '@@user/SHOW_REQUEST_RESET_PASSWORD_CONFIRMATION';
const SET_PERMISSIONS = '@@user/SET_PERMISSIONS';
const SET_PODCAST_NETWORK = '@@user/SET_PODCAST_NETWORK';
const RECEIVE_REFERRAL_CODE = '@@user/RECEIVE_REFERRAL_CODE';
const RECEIVE_CALL_JOIN_CODE = '@@user/RECEIVE_CALL_JOIN_CODE';
const RECEIVE_HOST_NAME = '@@user/RECEIVE_HOST_NAME';
const RECEIVE_SHARE_LINK_PATH = '@@user/RECEIVE_SHARE_LINK_PATH';
const RECEIVE_SOCIAL_URLS = '@@user/RECEIVE_SOCIAL_URLS';
const SET_USER_VERIFICATION_STATE = '@@user/SET_USER_VERIFICATION_STATE';

export const MENU_MODE = {
  LOGIN: 'login',
  CREATE_ACCOUNT: 'create',
  REQUEST_RESET_PASSWORD: 'requestResetPassword',
  REQUEST_RESET_PASSWORD_CONFIRMATION: 'requestResetPasswordConfirmation',
};

const initialState = {
  callJoinCode: null,
  user: null,
  stationId: null,
  hostName: null,
  menuMode: MENU_MODE.LOGIN,
  permissions: null,
  podcastNetwork: null,
  referralCode: null,
  shareLinkPath: null,
  shareLinkEmbedPath: null,
  socialUrls: {},
};

// reducer

function reducer(state = initialState, action) {
  switch (action.type) {
    case UNSET_USER: {
      return {
        ...state,
        user: null,
      };
    }
    case SET_USER: {
      const { user, stationId, networkRoleUserId } = action;
      return {
        ...state,
        user,
        stationId,
        networkRoleUserId,
        menuMode: MENU_MODE.LOGIN, // if a user was set, we should default back to log in popup
      };
    }
    case SET_PERMISSIONS: {
      const { permissions } = action;
      return {
        ...state,
        permissions,
      };
    }
    case SET_PODCAST_NETWORK: {
      return {
        ...state,
        podcastNetwork: action.payload,
      };
    }
    case SHOW_CREATE_ACCOUNT: {
      return {
        ...state,
        menuMode: MENU_MODE.CREATE_ACCOUNT,
      };
    }
    case SHOW_LOGIN: {
      return {
        ...state,
        menuMode: MENU_MODE.LOGIN,
      };
    }
    case SHOW_REQUEST_RESET_PASSWORD: {
      return {
        ...state,
        menuMode: MENU_MODE.REQUEST_RESET_PASSWORD,
      };
    }
    case SHOW_REQUEST_RESET_PASSWORD_CONFIRMATION: {
      return {
        ...state,
        menuMode: MENU_MODE.REQUEST_RESET_PASSWORD_CONFIRMATION,
      };
    }
    case RECEIVE_CALL_JOIN_CODE: {
      return {
        ...state,
        callJoinCode: action.callJoinCode,
      };
    }
    case RECEIVE_REFERRAL_CODE: {
      return {
        ...state,
        referralCode: action.referralCode,
      };
    }
    case RECEIVE_HOST_NAME: {
      return {
        ...state,
        hostName: action.payload.hostName,
      };
    }
    case RECEIVE_SHARE_LINK_PATH: {
      return {
        ...state,
        shareLinkPath: action.payload.shareLinkPath,
        shareLinkEmbedPath: action.payload.shareLinkEmbedPath,
      };
    }
    case RECEIVE_PODCAST_METADATA: {
      return {
        ...state,
        user: {
          ...state.user,
          name: action.payload.authorName,
        },
      };
    }
    case RECEIVE_SOCIAL_URLS: {
      return {
        ...state,
        socialUrls: action.payload.urls,
      };
    }
    case SET_USER_VERIFICATION_STATE: {
      const { userVerificationState, hasValidBirthdate } = action.user;
      return {
        ...state,
        user: {
          ...state.user,
          userVerificationState,
          hasValidBirthdate,
        },
      };
    }
    default:
      return state;
  }
}

// selectors

export const selectHasValidBirthdate = state =>
  state.user.user && state.user.user.hasValidBirthdate;

// action creators

export function setUser({
  imageUrl,
  userId,
  name,
  stationId,
  email,
  networkRoleUserId,
  userVerificationState,
  hostDomain,
}) {
  return {
    type: SET_USER,
    user: {
      userId,
      name,
      imageUrl,
      email,
      userVerificationState,
      hostDomain,
    },
    stationId,
    networkRoleUserId,
  };
}

export function setUserVerificationState({
  userVerificationState,
  hasValidBirthdate,
}) {
  return {
    type: SET_USER_VERIFICATION_STATE,
    user: {
      userVerificationState,
      hasValidBirthdate,
    },
  };
}

export function fetchUserVerificationState() {
  return dispatch => {
    AnchorAPI.fetchUserVerificationState().then(user => {
      dispatch(setUserVerificationState(user));
    });
  };
}
export function unsetUser() {
  return {
    type: UNSET_USER,
  };
}

export function submitLoginFormEvent() {
  return {
    type: '', // no actual actions
    meta: {
      analytics: {
        type: 'event-account-submit',
        payload: {
          target: 'Log In Form',
        },
      },
    },
  };
}

function submitCreateAccountFormEvent() {
  return {
    type: '', // no actual actions
    meta: {
      analytics: {
        type: 'event-account-submit',
        payload: {
          target: 'Create Account Form',
        },
      },
    },
  };
}

function submitRequestResetPasswordFormEvent() {
  return {
    type: '', // no actual actions
    meta: {
      analytics: {
        type: 'event-account-submit',
        payload: {
          target: 'Forgot Password Form',
        },
      },
    },
  };
}

export function showCreateAccount(target) {
  return {
    type: SHOW_CREATE_ACCOUNT,
    meta: {
      analytics: {
        type: 'event-account-click',
        payload: {
          target,
        },
      },
    },
  };
}

export function showLogin(target) {
  return {
    type: SHOW_LOGIN,
    meta: {
      analytics: {
        type: 'event-account-click',
        payload: {
          target,
        },
      },
    },
  };
}

export function showRequestResetPassword(target) {
  return {
    type: SHOW_REQUEST_RESET_PASSWORD,
    meta: {
      analytics: {
        type: 'event-account-click',
        payload: {
          target,
        },
      },
    },
  };
}

export function showRequestResetPasswordConfirmation() {
  return {
    type: SHOW_REQUEST_RESET_PASSWORD_CONFIRMATION,
  };
}

function setPodcastNetwork(network) {
  return {
    type: SET_PODCAST_NETWORK,
    payload: network,
  };
}

function setPermissions(permissions) {
  return {
    type: SET_PERMISSIONS,
    permissions,
  };
}

function receiveShareLinkPath(payload) {
  return {
    type: RECEIVE_SHARE_LINK_PATH,
    payload,
  };
}

export function receiveCallJoinCode(callJoinCode) {
  return {
    type: RECEIVE_CALL_JOIN_CODE,
    callJoinCode,
  };
}

export function receiveReferralCode(referralCode) {
  return {
    type: RECEIVE_REFERRAL_CODE,
    referralCode,
  };
}

export function receiveHostName(hostName) {
  return {
    type: RECEIVE_HOST_NAME,
    payload: {
      hostName,
    },
  };
}

// thunks

export function requestToLogOutUser() {
  return (dispatch, getState) =>
    new Promise((resolve, reject) => {
      fetch('/api/logout', {
        method: 'POST',
        credentials: 'same-origin',
      })
        .then(resolve)
        .catch(reject);
    }).finally(() => {
      dispatch(checkAuthentication());
    });
}

export function checkAuthentication(args = {}) {
  const {
    baseUrl = '',
    isFromSignup = false,
    shouldRedirectToDashboard = true,
    redirectTo,
  } = args;
  return (dispatch, getState) => {
    // fetch user auth, then check cookie
    return getCurrentUser(baseUrl).then(({ user }) => {
      if (user) {
        // set this value for redirect for `/create-new-episode` path
        localStorage.setItem(IS_EXISTING_USER_KEY, true);

        const {
          user: { permissions, shareLinkPath },
          routing: { location },
        } = getState();
        const query = location && queryString.parse(location.search);
        const promises = [];
        if (!shareLinkPath) {
          promises.push(dispatch(fetchShareLinkPath(baseUrl)));
        }
        if (!permissions) {
          promises.push(dispatch(fetchPermissions(baseUrl)));
        }

        if (promises.length) {
          return Promise.all(promises).then(() => {
            setUserAndRedirect(user, query);
          });
        }
        setUserAndRedirect(user, query);
      } else {
        unsetUserAndRedirect(user);
      }
      return Promise.resolve();
    });

    function setUserAndRedirect(user, query) {
      dispatch(setUser(user));

      function redirectToDashboard(dashboardPath = '/dashboard') {
        if (!windowUndefined()) {
          // only bring users to dashboard in client
          dispatch(
            push(
              `${dashboardPath}${isFromSignup ? '?navigatedFrom=signup' : ''}`
            )
          );
        }
      }
      if (query && query.return_to) {
        // use regular redirect as some routes are handled by API (e.g. Stripe)
        const { return_to: returnTo } = query;

        // prevent xss and open redirect
        // if return_to starts with either `javascript`, `http`, or `//`
        // send user to the dashboard
        if (/^javascript|^\/\/|^http/.test(returnTo)) {
          redirectToDashboard();
        } else {
          dispatch(push(`${returnTo}`));
        }
        // a bit of a hack, but put something on the history stack
        // to indicate to our router onEnter HOC that something has
        // changed, so it re-evaluates whatever handler is present
        dispatch(push({ key: 'foo' }));
      } else if (shouldRedirectToDashboard || redirectTo) {
        if (windowUndefined()) {
          return redirectToDashboard(redirectTo);
        }
        if (redirectTo) {
          return redirectToDashboard(redirectTo);
        }
        return handleFinalRedirect(redirectToDashboard, user.userId);
      }
      return Promise.resolve();
    }

    function unsetUserAndRedirect(user) {
      dispatch(unsetUser());

      // a bit of a hack, but put something on the history stack
      // to indicate to our router onEnter HOC that something has
      // changed, so it re-evaluates whatever handler is present
      dispatch(push({ key: 'foo' }));
      dispatch({ type: 'RESET_APP' });

      // analytics
      onLogOut(user);
    }
  };
}

async function handleFinalRedirect(redirectToDashboard, userId) {
  try {
    // if user is SAI or vodcasting, redirect to episode page
    const { allEnabledFlags } = await AnchorAPI.fetchAllEnabledFeatureFlags(
      userId
    );
    if (
      allEnabledFlags.includes('streamingAdInsertionEnabled') ||
      allEnabledFlags.includes('spotifyVideoPodcastEnabled')
    ) {
      return redirectToDashboard('/dashboard/episodes');
    }

    // otherwise, redirect to one of the dashboards
    const { networkRole } = await AnchorAPI.fetchCurrentUserPodcastNetwork();
    const dashboardPath =
      networkRole === 'admin' ? '/dashboard/network' : '/dashboard';
    return redirectToDashboard(dashboardPath);
  } catch (err) {
    return redirectToDashboard('/');
  }
}

export function submitLogInForm(
  data,
  callback = null,
  shouldRedirectToDashboard = true
) {
  return (dispatch, getState) => {
    dispatch(submitLoginFormEvent());
    const { onboarding } = getState();
    return fetch('/api/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        // pass beta code in case this is part of onboarding
        betaCode: onboarding.validBetaCode,
        ...data,
      }),
    }).then(response => {
      const { status } = response;
      if (
        status === 400 ||
        status === 401 ||
        status === 403 ||
        status === 429
      ) {
        return response.text().then(() => {
          throw new Error(status);
        });
      }
      dispatch(checkAuthentication({ shouldRedirectToDashboard })).then(() => {
        if (callback) return callback();
        return Promise.resolve();
      });
      return Promise.resolve();
    });
  };
}

export function isValidEmail(email) {
  return VALID_USER_EMAIL_REGEX.test(email);
}

export function isValidPassword(password) {
  return password.length >= MINIMUM_PASSWORD_CHARACTER_COUNT;
}

function getSignupErrorMessage(statusCode) {
  switch (statusCode) {
    case 409:
      return EXISTING_EMAIL_ERROR_MESSAGE;
    case 410:
      return EXISTING_ACCOUNT_ERROR_MESSAGE;
    case 422:
      return BIRTHDATE_ERROR_MESSAGE;
    case 500:
    default:
      return FRIENDLY_ERROR_MESSAGE;
  }
}

export function submitCreateAccountForImportForm(
  data,
  callback,
  setError,
  optimizelyId
) {
  return (dispatch, getState) => {
    const {
      onboarding: { validBetaCode },
    } = getState();
    dispatch(submitCreateAccountFormEvent());

    return fetch('/api/user/account/', {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
        [ANCHOR_CLIENT_OPTIMIZELY_USER_ID]: optimizelyId, // TODO https://anchorfm.atlassian.net/browse/OPTIMUS-429: Remove Optimizely Logic in Pub-Web after Age Gating Experiment
      }),
      body: JSON.stringify({
        betaCode: validBetaCode,
        captchaversion: 2,
        doAddToEmailList: false,
        ...data,
        vanitySlug: data.vanitySlug || data.name,
      }),
    }).then(response => {
      const { status: statusCode } = response;
      // TODO: Sometimes a successful account creation returns 404... why??
      if (response.ok) {
        trackEvent(
          'importing_ux_sign_up_success',
          { type: 'email' },
          { providers: [mParticle] }
        );
        dispatch(
          checkAuthentication({
            isFromSignup: true,
            shouldRedirectToDashboard: false,
          })
        ).then(() => {
          callback();
        });
      } else {
        const errorMessage = getSignupErrorMessage(statusCode);
        // Set error for SignupForm
        setError(errorMessage);
      }
      return Promise.resolve();
    });
  };
}

export function submitCreateAccountForm(
  data,
  callback = null,
  options = { captchaversion: 2, doAddToEmailList: false },
  optimizelyId
) {
  return (dispatch, getState) => {
    const { onboarding } = getState();
    dispatch(submitCreateAccountFormEvent());
    const isWordpressReferral = options.ref === 'wp';
    return fetch('/api/user/account/', {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
        [ANCHOR_CLIENT_OPTIMIZELY_USER_ID]: optimizelyId, // TODO https://anchorfm.atlassian.net/browse/OPTIMUS-429: Remove Optimizely Logic in Pub-Web after Age Gating Experiment
      }),
      body: JSON.stringify({
        betaCode: onboarding.validBetaCode,
        captchaversion: options.captchaversion,
        doAddToEmailList: options.doAddToEmailList,
        isWordpressReferral,
        ...data,
        vanitySlug: data.vanitySlug || data.name,
      }),
    }).then(response => {
      const { status: statusCode } = response;
      // TODO: Sometimes a successful account creation returns 404... why??
      if (response.ok) {
        dispatch(
          checkAuthentication({
            isFromSignup: true,
            redirectTo: isWordpressReferral ? '/dashboard/episodes' : undefined,
          })
        ).then(() => {
          if (callback) {
            return callback();
          }
          return Promise.resolve();
        });
      } else {
        const errorMessage = getSignupErrorMessage(statusCode);
        // Throw error for SignupForm
        throw new Error(errorMessage);
      }
      return Promise.resolve();
    });
  };
}

export function submitRequestResetPasswordForm(data) {
  return (dispatch, getState) => {
    dispatch(submitRequestResetPasswordFormEvent());
    return AnchorAPI.requestPasswordReset({ emailAddress: data.email })
      .then(response => {
        const { status } = response;
        if (status === 400) {
          throw new Error('There was a problem with this email.');
        }
        // assume 200 ok
        dispatch(push('/login'));
        dispatch(showRequestResetPasswordConfirmation());
      })
      .catch(() => {
        throw new Error(
          'There was a problem requesting a password reset. Please reach out to support for more help at https://help.anchor.fm.'
        );
      });
  };
}

export function fetchPermissions(baseUrl = '') {
  return dispatch =>
    fetch(`${baseUrl}/api/permissions`, {
      credentials: 'same-origin',
    })
      .then(response => {
        const { status } = response;
        if (status === 200) {
          return response.json();
        }
        return null;
      })
      .then(responseJson => {
        if (responseJson && responseJson.permissions) {
          dispatch(setPermissions(responseJson.permissions));
        }
        if (responseJson && responseJson.podcastNetwork) {
          dispatch(setPodcastNetwork(responseJson.podcastNetwork));
        }
      });
}

export function unsetAndRedirectUser(url) {
  return dispatch => {
    dispatch(unsetUser());
    dispatch(push(url || '/login'));
  };
}

function fetchShareLinkPath(baseUrl = '') {
  return dispatch =>
    fetch(`${baseUrl}/api/user/sharelinkpath`, {
      credentials: 'same-origin',
    })
      .then(response => {
        const { status } = response;
        if (status === 200) {
          return response.json();
        }
        return null;
      })
      .then(responseJson => {
        if (responseJson && responseJson.shareLinkPath) {
          dispatch(receiveShareLinkPath(responseJson));
        }
      });
}

// misc

export async function getCurrentUser(baseUrl = '') {
  try {
    const response = await fetch(`${baseUrl}/api/currentuser`, {
      method: 'GET',
      credentials: 'same-origin',
    });

    if (response.ok) {
      return response.json();
    }

    throw new Error('Unexpected error');
  } catch (err) {
    throw new Error(err.message);
  }
}

// errors shape matches values input
export function validateEmail(values) {
  const errors = {};
  if (!values.email) {
    errors.email = 'An email address is required';
  }
  return errors;
}

export default reducer;
