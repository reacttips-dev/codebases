import { CAN_RECEIVE_PUSH, SAVE_PUSH_ENDPOINT, SAVE_PUSH_TOPICS, TOGGLE_PUSH_OVERLAY } from 'constants/reduxActions';
import { err, setError } from 'actions/errors';
import { getNotificationSubscriptions, registerNotifications, subscribeNotifications, unSubscribeNotifications } from 'apis/mafia';
import { fetchErrorMiddleware } from 'middleware/fetchErrorMiddleware';
import { trackError } from 'helpers/ErrorUtils';

export function savePushSubscriptions(subscriptions) {
  return {
    type: SAVE_PUSH_TOPICS,
    subscriptions
  };
}

export function toggleNotificationsOverlay() {
  return {
    type: TOGGLE_PUSH_OVERLAY
  };
}

export function saveEndpoint(subscriptions) {
  return {
    type: SAVE_PUSH_ENDPOINT,
    subscriptions
  };
}

export function canReceiveNotifications() {
  return {
    type: CAN_RECEIVE_PUSH
  };
}

export function register(subscription, fetch = registerNotifications) {
  return function(dispatch, getState) {
    const { cookies, environmentConfig: { api: { mafia } } } = getState();
    return fetch(mafia, subscription, cookies)
      .then(fetchErrorMiddleware)
      .then(response => {
        if (response.message) {
          dispatch(fetchNotificationSubscriptions(subscription.endpoint));
        }
      })
      .catch(e => dispatch(setError(err.NOTIFICATIONS, e)));
  };
}

export function fetchNotificationSubscriptions(endpoint, fetch = getNotificationSubscriptions) {
  return function(dispatch, getState) {
    const { cookies, environmentConfig: { api: { mafia } } } = getState();
    return fetch(mafia, endpoint, cookies)
      .then(fetchErrorMiddleware)
      .then(response => {
        if (response.subscriptions && response.subscriptions.length > 0) {
          dispatch(saveEndpoint(endpoint));
          dispatch(savePushSubscriptions(response.subscriptions));
        }
        return response;
      })
      .catch(e => trackError('NON-FATAL', 'Could not retrieve customers push subscriptions', e));
  };
}

export function subscribe(subscriptionName, endpoint, fetch = subscribeNotifications) {
  return function(dispatch, getState) {
    const { cookies, environmentConfig: { api: { mafia } } } = getState();
    return fetch(mafia, subscriptionName, endpoint, cookies)
      .then(fetchErrorMiddleware)
      .then(response => {
        if (response.message) {
          dispatch(fetchNotificationSubscriptions(endpoint));
        }
      })
      .catch(e => trackError('NON-FATAL', `Could not subscribe customer to push subscription: ${subscriptionName}`, e));
  };
}

export function unSubscribe(subscriptionName, endpoint, fetch = unSubscribeNotifications) {
  return function(dispatch, getState) {
    const { cookies, environmentConfig: { api: { mafia } } } = getState();
    return fetch(mafia, subscriptionName, endpoint, cookies)
      .then(fetchErrorMiddleware)
      .then(response => {
        if (response.message) {
          dispatch(fetchNotificationSubscriptions(endpoint));
        }
      })
      .catch(e => trackError('NON-FATAL', `Could not retrieve unsubscribe push subscription: ${subscriptionName}`, e));
  };
}
