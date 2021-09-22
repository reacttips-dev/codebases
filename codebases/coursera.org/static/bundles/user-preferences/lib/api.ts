import URI from 'jsuri';
import Q from 'q';
import API from 'bundles/phoenix/lib/apiWrapper';
import handleResponse from 'bundles/naptime/handleResponse';
import user from 'js/lib/user';
import logger from 'js/app/loggerSingleton';

const apiClient = API('/api/userPreferences.v1', { type: 'rest' });

const makeKeyForUser = (key: $TSFixMe) => user.get().id + '~' + key;

export const keyEnum = {
  ONBOARDING: 'ONBOARDING',
  INVITATION: 'INVITATION',
  PAYMENT: 'PAYMENT',
  STORE_CREDIT_CARD: 'saveCreditCard',
  HONORS: 'HONORS',
  S12N_UPGRADE: 'S12N_UPGRADE',
  ADMIN_SELECTED_PARTNER: 'ADMIN_SELECTED_PARTNER',
  PROMOTION_LANDING_PAGE: 'PROMOTION_LANDING_PAGE',
  GENERIC: 'GENERIC',
  RECENTLY_VIEWED_XDP: 'RECENTLY_VIEWED_XDP',
} as const;

type KeyEnumKeys = keyof typeof keyEnum;

/**
 * @param  {String} key Should be defined in keyEnum
 * @return {Promise}
 */
export const get = (key: KeyEnumKeys): Q.Promise<$TSFixMe> => {
  if (!keyEnum[key]) {
    throw new Error('Invalid user preference key: ' + key);
  }

  return Q(apiClient.get(makeKeyForUser(key)))
    .then(handleResponse)
    .then(({ elements }) => {
      const element = elements && elements[0];
      const definition = element && element.preference && element.preference.definition;
      return definition;
    });
};

/**
 * @param  {String} key Should be defined in keyEnum
 * @return {Promise}
 */
export const getAndHandleFailure = (key: KeyEnumKeys): Q.Promise<$TSFixMe> => {
  return get(key).fail((error) => {
    logger.error('Could not GET user preferences for key ' + key);
  });
};

/**
 * @param  {String} key Should be defined in keyEnum
 * @param  {Object} definition
 * @return {Promise}
 */
export const set = (key: KeyEnumKeys, definition: $TSFixMe) => {
  if (!keyEnum[key]) {
    throw new Error('Invalid user preference key: ' + key);
  }

  return Q(
    apiClient.put(makeKeyForUser(key), {
      data: {
        preference: {
          typeName: key,
          definition,
        },
      },
    })
  ).fail((err) => {
    logger.error('Could not PUT user preferences for preference key ' + key);
  });
};

export const setOrUpdateGenericActivity = (activityId: $TSFixMe) => {
  const uri = new URI()
    .addQueryParam('action', 'setOrUpdateGenericActivity')
    .addQueryParam('id', user.get().id)
    .addQueryParam('activityId', activityId);

  return Q(apiClient.post(uri.toString())).fail((err) => {
    logger.error('Could not POST user preferences for GENERIC preference key');
  });
};

export const setOrUpdateRecentlyViewedXDP = (productId: $TSFixMe, sessionId: $TSFixMe) => {
  const uri = new URI()
    .addQueryParam('action', 'setOrUpdateRecentlyViewedXDP')
    .addQueryParam('sessionId', 'SESSION~' + sessionId)
    .addQueryParam('productId', productId);
  if (user.isAuthenticatedUser()) {
    uri.addQueryParam('id', user.get().id);
  }
  return Q(apiClient.post(uri.toString())).fail((err) => {
    logger.error('Could not POST user preferences for RECENTLY_VIEWED_XDP preference key');
  });
};

export const updateAndGetRecentlyViewedXDP = (sessionId: $TSFixMe): Q.Promise<$TSFixMe> => {
  const uri = new URI()
    .addQueryParam('action', 'updateAndGetRecentlyViewedXDP')
    .addQueryParam('sessionId', 'SESSION~' + sessionId);
  if (user.isAuthenticatedUser()) {
    uri.addQueryParam('id', user.get().id);
  }
  return Q(apiClient.post(uri.toString()))
    .then(({ preference }) => {
      return preference?.definition;
    })
    .fail((_) => {
      logger.error('Could not POST for updating and getting RECENTLY_VIEWED_XDP preference key');
    });
};

export default {
  keyEnum,
  get,
  getAndHandleFailure,
  set,
  setOrUpdateGenericActivity,
  setOrUpdateRecentlyViewedXDP,
};
