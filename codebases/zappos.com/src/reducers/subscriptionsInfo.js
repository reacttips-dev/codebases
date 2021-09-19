import Immutable from 'seamless-immutable';

import {
  RECEIVE_SUBSCRIPTIONS_INFO,
  RECEIVE_SUBSCRIPTIONS_SIGNUP_CAPTCHA,
  RECEIVE_SUBSCRIPTIONS_SIGNUP_RESPONSE,
  REQUEST_SUBSCRIPTIONS_INFO,
  SUBSCRIPTION_BRAND_TOGGLED,
  SUBSCRIPTION_LIST_TOGGLED,
  SUBSCRIPTION_STOCK_TOGGLED
} from 'constants/reduxActions';

const initialSubscriptionsState = {
  emailLists: [],
  brandSubscriptions: [],
  stockSubscriptions: []
};

const initialState = {
  subscriptions: Immutable(initialSubscriptionsState),
  subscriptionsDelta: Immutable(initialSubscriptionsState),
  selectedEmailListName: null,
  selectedBrandId: null,
  selectedAsin: null,
  isLoaded: false
};

export default function subscriptionsInfo(state = initialState, action) {
  const { type, selectedEmailListName, selectedBrandId, selectedAsin, captcha, successfulSignup, errors } = action;
  let newState = Immutable(state);
  const { subscriptions, subscriptionsDelta } = newState;

  switch (type) {
    case REQUEST_SUBSCRIPTIONS_INFO:
      return { ...state, isLoaded: false };
    case RECEIVE_SUBSCRIPTIONS_SIGNUP_CAPTCHA:
      return { ...state, captcha, isLoaded: true };
    case RECEIVE_SUBSCRIPTIONS_SIGNUP_RESPONSE:
      return { ...state, successfulSignup, errors, isLoaded: true };
    case RECEIVE_SUBSCRIPTIONS_INFO:
      return {
        ...state,
        subscriptions: action.subscriptions,
        optout: action.optout,
        subscriptionsDelta: Immutable(initialSubscriptionsState),
        isLoaded: true
      };
    case SUBSCRIPTION_LIST_TOGGLED: {
      const index = subscriptions.emailLists.findIndex(emailList => emailList.emailListName === selectedEmailListName);
      newState = newState.updateIn(['subscriptions', 'emailLists', index, 'subscribed'], v => !v);

      const deltaIndex = subscriptionsDelta.emailLists.findIndex(emailList => emailList.emailListName === selectedEmailListName);
      if (deltaIndex !== -1) {
        newState = newState.updateIn(['subscriptionsDelta', 'emailLists', deltaIndex, 'subscribed'], v => !v);
      } else {
        newState = newState.updateIn(['subscriptionsDelta', 'emailLists'], v => v.concat(
          [newState.subscriptions.emailLists[index]]
        ));
      }

      return newState;
    }
    case SUBSCRIPTION_BRAND_TOGGLED: {
      const index = subscriptions.brandSubscriptions.findIndex(brand => brand.id === selectedBrandId);
      newState = newState.updateIn(['subscriptions', 'brandSubscriptions', index, 'subscribed'], v => !v);

      const deltaIndex = subscriptionsDelta.brandSubscriptions.findIndex(brand => brand.id === selectedBrandId);
      if (deltaIndex !== -1) {
        newState = newState.updateIn(['subscriptionsDelta', 'brandSubscriptions', deltaIndex, 'subscribed'], v => !v);
      } else {
        newState = newState.updateIn(['subscriptionsDelta', 'brandSubscriptions'], v => v.concat(
          [newState.subscriptions.brandSubscriptions[index]]
        ));
      }

      return newState;
    }
    case SUBSCRIPTION_STOCK_TOGGLED: {
      const index = subscriptions.stockSubscriptions.findIndex(product => product.asin === selectedAsin);
      newState = newState.updateIn(['subscriptions', 'stockSubscriptions', index, 'subscribed'], v => !v);

      const deltaIndex = subscriptionsDelta.stockSubscriptions.findIndex(product => product.asin === selectedAsin);
      if (deltaIndex !== -1) {
        newState = newState.updateIn(['subscriptionsDelta', 'stockSubscriptions', deltaIndex, 'subscribed'], v => !v);
      } else {
        newState = newState.updateIn(['subscriptionsDelta', 'stockSubscriptions'], v => v.concat(
          [newState.subscriptions.stockSubscriptions[index]]
        ));
      }

      return newState;
    }
    default:
      return state;
  }
}
