import { fetchErrorMiddlewareMaybeJson } from 'middleware/fetchErrorMiddleware';
import { subscribeToBrand, subscribeToBrandZSub, subscribeToList, subscribeToListZSub } from 'apis/mafia';
import { trackError } from 'helpers/ErrorUtils';
import { isAssigned } from 'actions/ab';
import { HYDRA_SUBSCRIPTION_TEST } from 'constants/hydraTests';

export function subscribeToBrandNotification(emailAddress, brandId) {
  return (dispatch, getState) => {
    const state = getState();
    const { cookies, environmentConfig: { api: { mafia } } } = state;
    const hydraNewSubscriptionService = isAssigned(HYDRA_SUBSCRIPTION_TEST, 1, state);
    const subscribe = hydraNewSubscriptionService ? subscribeToBrandZSub : subscribeToBrand;

    return subscribe(mafia, {
      emailAddress,
      brandIds: [brandId]
    }, cookies)
      .then(fetchErrorMiddlewareMaybeJson)
      .then(() => true)
      .catch(e => {
        trackError('NON-FATAL', 'Could not subscribe to brand notifications.', e);
      });
  };
}

export function subscribeToLandingList(emailAddress, listId) {
  return (dispatch, getState) => {
    const state = getState();
    const subsiteId = 1;
    const { cookies, environmentConfig: { api: { mafia } } } = state;
    const hydraNewSubscriptionService = isAssigned(HYDRA_SUBSCRIPTION_TEST, 1, state);
    const subscribe = hydraNewSubscriptionService ? subscribeToListZSub : subscribeToList;

    return subscribe(mafia, {
      subsiteId,
      emailAddress,
      listIds: [listId]
    }, cookies)
      .then(fetchErrorMiddlewareMaybeJson)
      .then(() => true)
      .catch(e => {
        trackError('NON-FATAL', 'Could not subscribe to list.', e);
      });
  };
}
