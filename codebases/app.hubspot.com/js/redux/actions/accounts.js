'use es6';

import { fromJS } from 'immutable';
import { getFullUrl } from 'hubspot-url-utils';
import actionTypes from './actionTypes';
import { setConnectingAccountGuid, setConnectStep, showNotification, updateUi, setConnectingNetwork } from './ui';
import { getAppSection, getFromApp } from '../selectors';
import { getConnectingNetwork } from '../selectors/accounts';
import { getPublishableChannels } from '../selectors/channels';
import { ACCOUNT_CONNECT_FAILURE_REASONS, ACCOUNT_TYPES, ACCOUNT_TYPES_TO_OAUTHOR_SERVICE, APP_SECTIONS, CONNECT_STEPS, getAccountDisplayName, SINGLE_CHANNEL_ACCOUNT_TYPES, YOUTUBE_CONNECT_FAILURE_REASONS, ACCOUNT_CONNECT_ERROR_CODES } from '../../lib/constants';
import Account from '../../data/model/Account';
import Channel from '../../data/model/Channel';
import AccountManager from '../../data/AccountManager';
import AMPLITUDE_EVENTS from '../../lib/usageEvents';
import { trackInteraction } from './usage';
import { logError, getNotificationFor } from '../../lib/utils';
import { openPopup } from '../../lib/auth';
import { fetchAccountsWithChannels } from './actions';
var accountManager = AccountManager.getInstance();

var handleAccountConnectionFailure = function handleAccountConnectionFailure(_ref) {
  var channels = _ref.channels,
      data = _ref.data,
      error = _ref.error,
      dispatch = _ref.dispatch,
      state = _ref.state;
  var failureReason = null;

  if (typeof error === 'object') {
    failureReason = error.message; // Handle specific errors based on the error code

    if (typeof error.errorCode === 'string') {
      failureReason = ACCOUNT_CONNECT_ERROR_CODES[error.errorCode];
    } // If no account/channels could be found
    else if (typeof error.responseJSON === 'object' && typeof error.responseJSON.message === 'string' && error.responseJSON.message.indexOf('Found no account/channels') !== -1) {
        failureReason = ACCOUNT_CONNECT_FAILURE_REASONS.noChannels;
      } // Handle specific errors from the response JSON
      else if (typeof error.responseJSON === 'object' && Array.isArray(error.responseJSON.errors) && error.responseJSON.errors.length > 0) {
          var possibleError = error.responseJSON.errors[0];

          if (ACCOUNT_CONNECT_FAILURE_REASONS[possibleError] || YOUTUBE_CONNECT_FAILURE_REASONS[possibleError]) {
            failureReason = ACCOUNT_CONNECT_FAILURE_REASONS[possibleError] || YOUTUBE_CONNECT_FAILURE_REASONS[possibleError];
          }
        }
  } // Handle errors that can be computed without the "error" object
  else if (!channels || typeof channels === 'object' && !channels.size) {
      failureReason = ACCOUNT_CONNECT_FAILURE_REASONS.noChannels;
    }

  data = data.set('failureReason', failureReason || ACCOUNT_CONNECT_FAILURE_REASONS.unknown);
  var trackingData = {
    'failure-reason': failureReason,
    fromApp: getFromApp(state)
  };
  dispatch(trackInteraction(AMPLITUDE_EVENTS.connectAccountFailure, trackingData, AMPLITUDE_EVENTS.connectAccountFailure));
  dispatch(setConnectStep(CONNECT_STEPS.error));
  dispatch(updateUi({
    accountConnectFailure: fromJS(data)
  }));
};

export var getAccountConnectFailureReason = function getAccountConnectFailureReason(accountConnectFailure) {
  if (accountConnectFailure.query) {
    // twitter uses ?denied=, facebook uses ?error=access_denied
    if (accountConnectFailure.query.denied || accountConnectFailure.query.error === 'access_denied') {
      return ACCOUNT_CONNECT_FAILURE_REASONS.refused;
    } // linkedin


    if (['user_cancelled_authorize', 'user_cancelled_login'].includes(accountConnectFailure.query.error)) {
      return ACCOUNT_CONNECT_FAILURE_REASONS.refused;
    }

    if (accountConnectFailure.query.error === 'internal_error') {
      return ACCOUNT_CONNECT_FAILURE_REASONS.networkError;
    }
  }

  return ACCOUNT_CONNECT_FAILURE_REASONS.unknown;
};
export var createAccount = function createAccount(network) {
  return function (dispatch, getState) {
    dispatch(setConnectingNetwork(network));
    var state = getState();
    var popup = openPopup('about:blank');

    if (network === ACCOUNT_TYPES.facebook || network === ACCOUNT_TYPES.linkedin || network === ACCOUNT_TYPES.youtube) {
      var oauthorService = ACCOUNT_TYPES_TO_OAUTHOR_SERVICE[network];
      popup.location.href = getFullUrl('app') + "/oauthor/v1/" + oauthorService + "/start/social?portalId=" + state.portal.portal_id;
    } else {
      dispatch({
        type: actionTypes.ACCOUNT_CREATE,
        apiRequest: function apiRequest() {
          return accountManager.createAccount(network).then(Account.createFrom).then(function (account) {
            popup.location.href = account.dataMap.get('authUri');
            return account;
          }).catch(function (err) {
            logError(err);

            try {
              popup.close();
            } catch (e) {
              // eslint-disable-next-line no-console
              console.warn('Could not close oauth popup after account creation failure');
            }

            if (err.status === 429) {
              err.messageCode = 'account_create.limit_exceeded';

              if (err.responseJSON && err.responseJSON.errorTokens) {
                err.messageContext = {
                  limit: state.portal.limits['social-connected-channels']
                };
              }
            }

            throw err;
          });
        }
      });
    }
  };
};
export var exchangeAuthCode = function exchangeAuthCode(account) {
  return function (dispatch, getState) {
    account.query.network = account.accountSlug;
    return dispatch({
      type: actionTypes.ACCOUNT_COMPLETE_AUTH,
      apiRequest: function apiRequest() {
        return accountManager.exchangeAuthCode(account).then(function (data) {
          if (data.channels) {
            return {
              account: Account.createFrom(data.account),
              channels: Channel.createFromArray(data.channels)
            };
          }

          return Account.createFrom(data);
        }).catch(function (err) {
          if (err.status === 409) {
            err.messageCode = 'account_complete_auth.conflict';
          } else if (err.status === 400 && err.responseJSON && err.responseJSON.errors) {
            var errorCode = err.responseJSON.errors[0];

            if (account.accountSlug === ACCOUNT_TYPES.youtube && errorCode) {
              err.messageCode = 'account_complete_auth.youtubeinvalid';
            }
          }

          handleAccountConnectionFailure({
            data: account,
            error: err,
            dispatch: dispatch,
            state: getState()
          });
          throw err;
        });
      }
    });
  };
};
export var fetchAccountsAndChannels = fetchAccountsWithChannels;

var showPostConnectNotification = function showPostConnectNotification(opts) {
  return function (dispatch, getState) {
    var channels = getPublishableChannels(getState());
    var accountChannels = channels.filter(function (c) {
      return c.accountGuids.includes(opts.accountGuid);
    });
    var notification = getNotificationFor(actionTypes.OAUTH_CALLBACK, 'success', {
      networkName: getAccountDisplayName(opts.accountSlug),
      accountsDisplay: accountChannels.map(function (a) {
        return a.name;
      }).toArray().join(', '),
      count: accountChannels.size
    });
    dispatch(showNotification(notification));
  };
};

export var refreshAfterAccountConnect = function refreshAfterAccountConnect() {
  var isOnboarding = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (dispatch) {
    return dispatch(fetchAccountsWithChannels()).then(function () {
      if (isOnboarding) {
        dispatch(showPostConnectNotification(opts));
      }
    });
  };
};
export var deleteAccount = function deleteAccount(guid) {
  return function (dispatch) {
    dispatch({
      type: actionTypes.ACCOUNT_DELETE,
      apiRequest: function apiRequest() {
        return accountManager.deleteAccount(guid).then(function (data) {
          dispatch(fetchAccountsAndChannels());
          return data;
        }).then(function () {
          return guid;
        });
      }
    });
  };
};
/*
Two failure scenarios here, either our postMessage from SocialOauthUI indicates a failures, or we succeeded in connecting
an account but have no channels
 */

var redirectToNextStep = function redirectToNextStep(account, channels) {
  var isOnboarding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return function (dispatch, getState) {
    if (channels.isEmpty()) {
      return handleAccountConnectionFailure({
        channels: channels,
        data: account,
        dispatch: dispatch,
        state: getState()
      });
    } // for accounts that have only 1 channel, simply need to refresh and message success


    if (SINGLE_CHANNEL_ACCOUNT_TYPES.includes(account.accountSlug)) {
      if (account.accountSlug === ACCOUNT_TYPES.twitter) {
        return dispatch(setConnectStep(CONNECT_STEPS.publishAnywhere));
      }

      if (isOnboarding) {
        dispatch(setConnectStep(null));
        return dispatch(refreshAfterAccountConnect(isOnboarding, account));
      } else {
        return dispatch(setConnectStep(CONNECT_STEPS.success));
      }
    } else {
      // otherwise move to Select Channels step
      return dispatch(setConnectStep(CONNECT_STEPS.selectChannels));
    }
  };
};

export var oauthorCallback = function oauthorCallback(data) {
  return function (dispatch, getState) {
    var state = getState();
    var network = getConnectingNetwork(state);
    var accountUserId = data.query.authedEmail;

    if (!network) {
      dispatch(setConnectStep(CONNECT_STEPS.error));
      dispatch(updateUi({
        accountConnectFailure: fromJS(data)
      }));
      return;
    }

    dispatch(setConnectStep(CONNECT_STEPS.saving));
    accountManager.connectAccount(network, accountUserId).then(function (resp) {
      var account = Account.createFrom(resp.account);
      var accountGuid = account.accountGuid;
      var isOnboarding = getAppSection(getState()) === APP_SECTIONS.onboarding;
      var trackingData = {
        network: account.get('accountSlug'),
        fromApp: getFromApp(getState())
      };
      dispatch({
        type: actionTypes.ACCOUNT_COMPLETE_AUTH_SUCCESS,
        data: {
          account: account,
          channels: Channel.createFromArray(resp.channels)
        }
      });
      dispatch(setConnectingAccountGuid(accountGuid));
      dispatch({
        type: actionTypes.ACCOUNT_CREATE_SUCCESS,
        data: account
      });
      dispatch({
        type: actionTypes.OAUTH_CALLBACK,
        payload: {
          accountGuid: accountGuid
        }
      });
      dispatch(fetchAccountsAndChannels());
      dispatch(updateUi({
        accountConnectFailure: fromJS(resp)
      }));
      dispatch(trackInteraction(AMPLITUDE_EVENTS.connectAccountActivation, trackingData, AMPLITUDE_EVENTS.connectAccountActivation));
      dispatch(trackInteraction(AMPLITUDE_EVENTS.connectAccount, trackingData, AMPLITUDE_EVENTS.connectAccount));
      dispatch(redirectToNextStep(account, fromJS(resp.channels), isOnboarding));
    }).catch(function (error) {
      handleAccountConnectionFailure({
        data: fromJS(data),
        error: error,
        dispatch: dispatch,
        state: getState()
      });
    });
  };
};
export var legacyOauthCallback = function legacyOauthCallback(account) {
  return function (dispatch, getState) {
    var _getState = getState(),
        pendingAccount = _getState.pendingAccount;

    if (pendingAccount) {
      account.accountSlug = pendingAccount.accountSlug;
      account.accountGuid = account.accountGuid || pendingAccount.accountGuid;
    }

    if (!account.accountGuid) {
      dispatch(setConnectStep(CONNECT_STEPS.error));
      return;
    }

    pendingAccount.query = account.query = account.query || {};
    var isOnboarding = getAppSection(getState()) === APP_SECTIONS.onboarding;
    dispatch({
      type: actionTypes.OAUTH_CALLBACK,
      payload: account
    });
    var trackingData = {
      network: account.accountSlug,
      apiVersion: account.apiVersion,
      fromApp: getFromApp(getState())
    };

    if (!account.completed && account.query.error) {
      account.failureReason = getAccountConnectFailureReason(account);
      trackingData['failure-reason'] = account.failureReason;
      dispatch(trackInteraction(AMPLITUDE_EVENTS.connectAccountFailure, trackingData, AMPLITUDE_EVENTS.connectAccountFailure));
      dispatch(fetchAccountsAndChannels());
      dispatch(setConnectStep(CONNECT_STEPS.error));
      dispatch(updateUi({
        accountConnectFailure: fromJS(account)
      }));
      return;
    }

    dispatch(trackInteraction(AMPLITUDE_EVENTS.connectAccountActivation, trackingData, AMPLITUDE_EVENTS.connectAccountActivation));
    dispatch(trackInteraction(AMPLITUDE_EVENTS.connectAccount, trackingData, AMPLITUDE_EVENTS.connectAccount));
    dispatch(setConnectStep(CONNECT_STEPS.saving));
    dispatch(setConnectingAccountGuid(account.accountGuid));
    dispatch(exchangeAuthCode(pendingAccount)).then(function (data) {
      // When a new account is being connected, the Guid returned from the backend
      // may be different than what's in the frontend, even if they're the same account.
      // The backend will attempt to reuse records on social media accounts that there
      // are already records for. The frontend doesn't know that there's already
      // an existing record for this account, though!
      // In that situation, we want to update the reference to that account in the frontend too
      // to maintain the consistency of account Guids.
      if (data && data.account && data.account.accountGuid !== pendingAccount.accountGuid) {
        dispatch(setConnectingAccountGuid(data.account.accountGuid));
      }

      if (account.accountSlug === ACCOUNT_TYPES.bitly) {
        return dispatch(refreshAfterAccountConnect(isOnboarding, account));
      }

      return dispatch(redirectToNextStep(pendingAccount, data.channels, isOnboarding));
    }).catch(function (err) {
      handleAccountConnectionFailure({
        data: account,
        error: err,
        dispatch: dispatch,
        state: getState()
      });
      throw err;
    });
  };
};