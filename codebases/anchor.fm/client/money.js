import Promise from 'bluebird';
import getStripeConnectLoginLinkFromStripeLinkId from 'anchor-server-common/utilities/money/getStripeConnectLoginLinkFromStripeLinkId';
import { unsetAndRedirectUser } from './user';
import AnchorAPIError from './modules/AnchorAPI/AnchorAPIError';
import AnchorAPI from './modules/AnchorAPI';

const CHANGE_BECOME_A_SUPPORTER_SCENE =
  '@@money/CHANGE_BECOME_A_SUPPORTER_SCENE';
const CHOOSE_PRODUCT = '@@money/CHOOSE_PRODUCT';
const HIDE_SUPPORTERS_MODAL = '@@money/HIDE_SUPPORTERS_MODAL';
const RECEIVE_AVAILABLE_BALANCE = '@@money/RECEIVE_AVAILABLE_BALANCE';
const RECEIVE_ALL_TIME_EARNINGS = '@@money/RECEIVE_ALL_TIME_EARNINGS';
const RECEIVE_DOES_ACCOUNT_SUPPORT_INSTANT_PAYOUT =
  '@@money/RECEIVE_DOES_ACCOUNT_SUPPORT_INSTANT_PAYOUT';
const RECEIVE_STATUS = '@@money/RECEIVE_STATUS';
const RECEIVE_SUPPORTERS = '@@money/RECEIVE_SUPPORTERS';
const RECEIVE_ORDER_CONFIRMATION = '@@money/RECEIVE_ORDER_CONFIRMATION';
const RECEIVE_LAST_PAYOUT = '@@money/RECEIVE_LAST_PAYOUT';
const ARE_STRIPE_REQUIREMENTS_MET = '@@money/ARE_STRIPE_REQUIREMENTS_MET';
const RECEIVE_IS_PAYOUT_ENABLED = '@@money/RECEIVE_IS_PAYOUT_ENABLED';
const SET_IS_FETCHING = '@@money/SET_IS_FETCHING';
const SET_IS_FETCHING_BALANCE = '@@money/SET_IS_FETCHING_BALANCE';
const SET_IS_FETCHING_STATUS = '@@money/SET_IS_FETCHING_STATUS';
const SET_IS_FETCHING_SUPPORTERS = '@@money/SET_IS_FETCHING_SUPPORTERS';
const SHOW_SUPPORTERS_MODAL = '@@money/SHOW_SUPPORTERS_MODAL';

const SET_PAYMENT_AS_PROCESSING = '@@money/SET_PAYMENT_AS_PROCESSING';
const SET_PAYMENT_AS_NOT_PROCESSING = '@@money/SET_PAYMENT_AS_NOT_PROCESSING';

const SHOW_PROFILE_PAYWALLS_MODAL = '@@money/SHOW_PROFILE_PAYWALLS_MODAL';
const HIDE_PROFILE_PAYWALLS_MODAL = '@@money/HIDE_PROFILE_PAYWALLS_MODAL';

const emptyArray = [];
const emptyObject = {};

const initialState = {
  availableBalance: 0,
  pendingBalance: 0,
  allTimeEarnings: emptyObject,
  status: {
    hasAuthenticatedStripe: false,
    hasSupportersEnabled: false,
    isAllowedToAuthenticateStripe: false,
    loginLink: null,
  },
  doesAccountSupportInstantPayout: false,
  isFetching: false, // supporters checkout fetch
  isFetchingBalance: false,
  isFetchingStatus: false,
  isFetchingSupporters: false,
  lastPayout: null,
  products: emptyArray,
  orderConfirmation: emptyObject,
  supporters: emptyArray,
  chosenProductId: null,
  becomeASupporterScene: 'pay',
  isShowingSupportersModal: false,
  isPaymentProcessing: false,
  areStripeRequirementsMet: false,
  isPayoutEnabled: false,
  isShowingProfilePaywallsModal: false,
};

// reducer

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_BECOME_A_SUPPORTER_SCENE: {
      const { becomeASupporterScene } = action.payload;
      return {
        ...state,
        becomeASupporterScene,
      };
    }
    case CHOOSE_PRODUCT: {
      const { chosenProductId } = action.payload;
      return {
        ...state,
        chosenProductId,
      };
    }
    case HIDE_SUPPORTERS_MODAL: {
      return {
        ...state,
        isShowingSupportersModal: false,
      };
    }
    case RECEIVE_AVAILABLE_BALANCE: {
      const { availableBalance, pendingBalance } = action.payload;
      return {
        ...state,
        availableBalance,
        pendingBalance,
      };
    }
    case RECEIVE_ALL_TIME_EARNINGS: {
      return {
        ...state,
        allTimeEarnings: action.payload,
      };
    }
    case RECEIVE_DOES_ACCOUNT_SUPPORT_INSTANT_PAYOUT: {
      return {
        ...state,
        doesAccountSupportInstantPayout: action.payload,
      };
    }
    case RECEIVE_LAST_PAYOUT: {
      return {
        ...state,
        lastPayout: action.payload,
      };
    }
    case RECEIVE_IS_PAYOUT_ENABLED: {
      return {
        ...state,
        isPayoutEnabled: action.payload,
      };
    }
    case ARE_STRIPE_REQUIREMENTS_MET: {
      return {
        ...state,
        areStripeRequirementsMet: action.payload,
      };
    }
    case RECEIVE_ORDER_CONFIRMATION:
      return {
        ...state,
        orderConfirmation: action.payload,
      };
    case RECEIVE_STATUS:
      return {
        ...state,
        status: action.payload,
      };
    case RECEIVE_SUPPORTERS:
      return {
        ...state,
        supporters: action.payload,
      };
    case SET_IS_FETCHING: {
      const { isFetching } = action.payload;
      return {
        ...state,
        isFetching,
      };
    }
    case SET_IS_FETCHING_BALANCE: {
      const { isFetchingBalance } = action.payload;
      return {
        ...state,
        isFetchingBalance,
      };
    }
    case SET_IS_FETCHING_STATUS: {
      const { isFetchingStatus } = action.payload;
      return {
        ...state,
        isFetchingStatus,
      };
    }
    case SET_IS_FETCHING_SUPPORTERS: {
      const { isFetchingSupporters } = action.payload;
      return {
        ...state,
        isFetchingSupporters,
      };
    }
    case SET_PAYMENT_AS_PROCESSING: {
      return {
        ...state,
        isPaymentProcessing: true,
      };
    }

    case SET_PAYMENT_AS_NOT_PROCESSING: {
      return {
        ...state,
        isPaymentProcessing: false,
      };
    }
    case SHOW_SUPPORTERS_MODAL: {
      return {
        ...state,
        isShowingSupportersModal: true,
      };
    }
    case SHOW_PROFILE_PAYWALLS_MODAL: {
      return {
        ...state,
        isShowingProfilePaywallsModal: true,
      };
    }
    case HIDE_PROFILE_PAYWALLS_MODAL: {
      return {
        ...state,
        isShowingProfilePaywallsModal: false,
      };
    }
    default:
      return state;
  }
}

// actions
export function changeBecomeASupporterScene(becomeASupporterScene) {
  return {
    type: CHANGE_BECOME_A_SUPPORTER_SCENE,
    payload: { becomeASupporterScene },
  };
}

export function chooseProductId(chosenProductId, chosenProduct = {}) {
  return {
    type: CHOOSE_PRODUCT,
    payload: { chosenProductId },
    meta: {
      analytics: {
        type: 'event-listener-support',
        payload: {
          type: 'tier_button_clicked',
          target: chosenProduct.price,
        },
      },
    },
  };
}

function receiveAvailableBalance({ availableBalance, pendingBalance }) {
  return {
    type: RECEIVE_AVAILABLE_BALANCE,
    payload: { availableBalance, pendingBalance },
  };
}

function receiveAllTimeEarnings(allTimeEarnings) {
  return {
    type: RECEIVE_ALL_TIME_EARNINGS,
    payload: allTimeEarnings,
  };
}

function receiveDoesAccountSupportInstantPayout(
  doesAccountSupportInstantPayout
) {
  return {
    type: RECEIVE_DOES_ACCOUNT_SUPPORT_INSTANT_PAYOUT,
    payload: doesAccountSupportInstantPayout,
  };
}

function receiveLastPayout(lastPayout) {
  return {
    type: RECEIVE_LAST_PAYOUT,
    payload: lastPayout,
  };
}

function receiveIsPayoutEnabled(isPayoutEnabled) {
  return {
    type: RECEIVE_IS_PAYOUT_ENABLED,
    payload: isPayoutEnabled,
  };
}

function areStripeRequirementsMet(areStripeRequirementsMet) {
  return {
    type: ARE_STRIPE_REQUIREMENTS_MET,
    payload: areStripeRequirementsMet,
  };
}

function receiveStatus(status = {}) {
  return {
    type: RECEIVE_STATUS,
    payload: status,
  };
}

function receiveSupporters(supporters = emptyArray) {
  return {
    type: RECEIVE_SUPPORTERS,
    payload: supporters,
  };
}

function setIsFetching(isFetching = false) {
  return {
    type: SET_IS_FETCHING,
    payload: { isFetching },
  };
}

function setIsFetchingBalance(isFetchingBalance = false) {
  return {
    type: SET_IS_FETCHING_BALANCE,
    payload: { isFetchingBalance },
  };
}

function setIsFetchingStatus(isFetchingStatus = false) {
  return {
    type: SET_IS_FETCHING_STATUS,
    payload: { isFetchingStatus },
  };
}

function setIsFetchingSupporters(isFetchingSupporters = false) {
  return {
    type: SET_IS_FETCHING_SUPPORTERS,
    payload: { isFetchingSupporters },
  };
}

function receiveOrderConfirmation(
  orderConfirmation = {},
  { nativePaymentPlatform } = {}
) {
  return {
    type: RECEIVE_ORDER_CONFIRMATION,
    payload: orderConfirmation,
    meta: {
      analytics: {
        type: 'event-listener-support',
        payload: {
          type: 'payment_processed',
          target: mapPlatformToEventTarget(nativePaymentPlatform),
        },
      },
    },
  };
}

export function trackListenerSupportCreatorEvent(payload) {
  return {
    type: '', // no actual actions
    meta: {
      analytics: {
        type: 'event-listener-support-creator',
        payload,
      },
    },
  };
}

export function trackListenerSupportEvent(payload) {
  return {
    type: '', // no actual actions
    meta: {
      analytics: {
        type: 'event-listener-support',
        payload,
      },
    },
  };
}

export function setPaymentAsProcessing() {
  return {
    type: SET_PAYMENT_AS_PROCESSING,
  };
}

export function setPaymentAsNotProcessing() {
  return {
    type: SET_PAYMENT_AS_NOT_PROCESSING,
  };
}

export function showSupportersModal() {
  return {
    type: SHOW_SUPPORTERS_MODAL,
    meta: {
      analytics: {
        type: 'event-listener-support',
        payload: {
          type: 'page_viewed',
          target: 'support_modal',
        },
      },
    },
  };
}

export function hideSupportersModal() {
  return {
    type: HIDE_SUPPORTERS_MODAL,
    meta: {
      analytics: {
        type: 'event-listener-support',
        payload: {
          type: 'close_button_clicked',
          target: 'support_modal',
        },
      },
    },
  };
}

export function showProfilePaywallsModal() {
  return {
    type: SHOW_PROFILE_PAYWALLS_MODAL,
  };
}

export function hideProfilePaywallsModal() {
  return {
    type: HIDE_PROFILE_PAYWALLS_MODAL,
  };
}

// thunks

export function fetchBalance({ bustCache = false } = {}) {
  return (dispatch, getState) => {
    dispatch(setIsFetchingBalance(true));
    return AnchorAPI.fetchMoneyWallet({ isCacheBust: bustCache })
      .then(responseJson => {
        if (
          responseJson &&
          typeof responseJson.currentWalletAmountInCents !== 'undefined'
        ) {
          dispatch(
            receiveAvailableBalance({
              availableBalance: responseJson.currentWalletAmountInCents,
              pendingBalance: responseJson.pendingWalletAmountInCents,
            })
          );
          dispatch(receiveAllTimeEarnings(responseJson.allTimeWalletBreakdown));
          dispatch(
            receiveDoesAccountSupportInstantPayout(
              responseJson.isInstantPayoutAvailable
            )
          );
          dispatch(receiveLastPayout(responseJson.lastPayout));
          dispatch(
            areStripeRequirementsMet(responseJson.areStripeRequirementsMet)
          );
          dispatch(receiveIsPayoutEnabled(responseJson.isPayoutEnabled));
        }
      })
      .finally(() => {
        dispatch(setIsFetchingBalance(false));
      });
  };
}

export function fetchStatus() {
  return (dispatch, getState) => {
    dispatch(setIsFetchingStatus(true));
    return fetch('/api/user/money/status', {
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
        if (
          responseJson &&
          typeof responseJson.hasAuthenticatedStripe !== 'undefined'
        ) {
          const {
            hasAuthenticatedStripe,
            hasSupportersEnabled,
            loginLink,
            isAllowedToAuthenticateStripe,
          } = responseJson;
          const status = {
            hasAuthenticatedStripe,
            hasSupportersEnabled,
            isAllowedToAuthenticateStripe,
            loginLink: getStripeConnectLoginLinkFromStripeLinkId(loginLink),
          };
          dispatch(receiveStatus(status));
          return status;
        }
      })
      .catch(err => console.log(err))
      .finally(() => {
        dispatch(setIsFetchingStatus(false));
      });
  };
}

// important that this returns a promise to the form submit handler
export function submitMoneyManagerForm(data = {}) {
  return (dispatch, getState) => {
    const { doEnableSupporters } = data;
    return new Promise((resolve, reject) => {
      fetch('/api/user/money/status', {
        method: 'PUT',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          hasSupportersEnabled: !!doEnableSupporters,
        }),
      })
        .then(resolve)
        .catch(reject);
    }).then(response => {
      const { status } = response;
      // e.g. no permissions (403)
      if (status === 403) {
        dispatch(push('/404'));
        return;
      }
      if (status === 401) {
        dispatch(unsetAndRedirectUser());
      }
      // stay on page
    });
  };
}

// important that this returns a promise to the form submit handler
export function submitSupportersCheckoutForm(data = {}, metadata = {}) {
  return (dispatch, getState) =>
    new Promise((resolve, reject) => {
      const { stationId } = data;
      if (!stationId) {
        reject(new Error('No station identified'));
        return;
      }
      fetch(`/api/station/${stationId}/support`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(data),
      })
        .then(resolve)
        .catch(reject);
    })
      .then(response => {
        const { status } = response;
        // stay on page
        if (status === 200 || status === 400) {
          return response.json();
        }
        return Promise.reject(new AnchorAPIError(response, 'Server error.'));
      })
      .then(responseJson => {
        if (responseJson.code) {
          const { nativePaymentPlatform } = metadata;
          dispatch(
            trackListenerSupportEvent({
              type: 'payment_failed',
              target: `${mapPlatformToEventTarget(nativePaymentPlatform)}_${
                responseJson.code
              }`,
            })
          );
          // Stripe error
          return Promise.reject(
            new AnchorAPIError(responseJson.code, 'Card error.')
          );
        }
        dispatch(receiveOrderConfirmation(responseJson, metadata));
      });
}

export function fetchSupporters() {
  return (dispatch, getState) => {
    dispatch(setIsFetchingSupporters(true));
    return new Promise((resolve, reject) => {
      fetch('/api/podcast/supporters', {
        credentials: 'same-origin',
      })
        .then(resolve)
        .catch(reject);
    })
      .then(response => {
        const { status } = response;
        if (status === 200) {
          return response.json();
        }
        return null;
      })
      .then(responseJson => {
        if (responseJson && typeof responseJson.supporters !== 'undefined') {
          dispatch(receiveSupporters(responseJson.supporters));
        }
      })
      .finally(() => {
        dispatch(setIsFetchingSupporters(false));
      });
  };
}

export function requestPayout({ isInstantPayout = false }) {
  return (dispatch, getState) => {
    dispatch(setIsFetching(true));
    return new Promise((resolve, reject) => {
      fetch('/api/proxy/v3/wallet/cashout', {
        credentials: 'same-origin',
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          isInstantPayout,
        }),
      })
        .then(resolve)
        .catch(reject);
    })
      .then(response => {
        const { status } = response;
        if (status === 200) {
          // TODO
          // alert('Payout created');
          return;
        }
        alert('An error creating a payout');
      })
      .finally(() => {
        dispatch(setIsFetching(false));
      });
  };
}

// misc

export function mapPlatformToEventTarget(platform) {
  return {
    applePay: 'apple',
    googlePay: 'google',
    creditCard: 'credit_card',
    genericPay: 'generic',
  }[platform];
}
