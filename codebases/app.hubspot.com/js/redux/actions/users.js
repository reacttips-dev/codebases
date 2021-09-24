'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { createAction } from 'flux-actions';
import { fromJS } from 'immutable';
import { identity } from 'underscore';
import actionTypes from './actionTypes';
import UserManager from '../../data/UserManager';
import User from '../../data/model/User';
import HubSettings from '../../data/model/HubSettings';
import UserAttributes from '../../data/model/UserAttributes';
import { getUserId } from '../selectors/user';
import { createSelector } from 'reselect';
import { getUserAttributes, getFavoriteChannelKeys } from '../selectors/users';
import { SHEPHERD_TOURS_USER_ATTRIBUTES, SHEPHERD_TOURS_STEPS, USER_ATTR_FAVORITE_CHANNEL_KEYS } from '../../lib/constants';
import { smartAdd, smartDelete } from '../../lib/utils';
import { trackInteraction } from './usage';
var userManager = UserManager.getInstance();
export var updateEmailSettings = createAction(actionTypes.EMAIL_SETTINGS_UPDATE, identity);
export var fetchEmailSettings = function fetchEmailSettings(userId) {
  return function (dispatch) {
    dispatch({
      type: actionTypes.EMAIL_SETTINGS_FETCH,
      apiRequest: function apiRequest() {
        return userManager.fetchEmailSettings(userId).then(function (data) {
          return fromJS(data);
        });
      }
    });
  };
};
export var saveEmailSettings = function saveEmailSettings() {
  return function (dispatch, getState) {
    var _getState = getState(),
        emailSettings = _getState.emailSettings;

    dispatch({
      type: actionTypes.EMAIL_SETTINGS_SAVE,
      apiRequest: function apiRequest() {
        return userManager.saveEmailSettings(emailSettings.toJS()).then(function (data) {
          return fromJS(data);
        });
      }
    });
  };
};
export var updateHubSetting = function updateHubSetting(key, value) {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.HUB_SETTINGS_SAVE,
      key: key,
      value: value,
      apiRequest: function apiRequest() {
        return userManager.saveHubSetting(key, value);
      }
    });
  };
};
export var fetchHubSettings = function fetchHubSettings() {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.HUB_SETTINGS_FETCH,
      apiRequest: function apiRequest() {
        return userManager.fetchHubSettings().then(function (data) {
          return HubSettings.createFrom(data.settings.map(function (s) {
            return [s.key, s.value];
          })).set('loaded', true);
        });
      }
    });
  };
};
export var fetchUserAttributes = function fetchUserAttributes() {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.USER_ATTRIBUTES_FETCH,
      apiRequest: function apiRequest() {
        return userManager.fetchAttributes().then(function (data) {
          return UserAttributes.createFrom(data);
        });
      }
    });
  };
};
export var deleteUserAttribute = function deleteUserAttribute(key) {
  return function (dispatch, getState) {
    var userId = getUserId(getState());
    return dispatch({
      type: actionTypes.USER_ATTRIBUTE_DELETE,
      apiRequest: function apiRequest() {
        return userManager.deleteAttribute(userId, key);
      }
    });
  };
};
export var fetchUsers = function fetchUsers() {
  return function (dispatch) {
    dispatch({
      type: actionTypes.USERS_FETCH_BEGAN
    });
    return userManager.fetchPortalUsers().then(function (data) {
      dispatch({
        type: actionTypes.USERS_FETCH_SUCCESS,
        data: User.createFromArray(data)
      });
    }).catch(function (error) {
      dispatch({
        type: actionTypes.USERS_FETCH_ERROR,
        error: error
      });
    });
  };
};
export var saveUserAttribute = function saveUserAttribute(_ref) {
  var key = _ref.key,
      value = _ref.value,
      _ref$callback = _ref.callback,
      callback = _ref$callback === void 0 ? function () {} : _ref$callback;
  return function (dispatch) {
    dispatch({
      type: actionTypes.USER_ATTRIBUTE_SAVE,
      apiRequest: function apiRequest() {
        return userManager.saveAttribute({
          key: key,
          value: value
        }).then(function () {
          callback();
          return _defineProperty({}, key, value);
        });
      }
    });
  };
};
export var onDismissBanner = function onDismissBanner(id) {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.DISMISS_BANNER,
      payload: id
    });
  };
};
export var updateDismissedBanners = function updateDismissedBanners() {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.UPDATE_DISMISSED_BANNERS
    });
  };
};
export var getDismissedBanners = function getDismissedBanners(state) {
  return state.bannerMessages;
};
export var getHasDismissedBanner = createSelector([getDismissedBanners, function (state, props) {
  return props.id;
}], function (dismissedBanners, id) {
  return dismissedBanners.includes(id);
});
export var dismissTourStep = function dismissTourStep(tourId, stepId, callback) {
  return function (dispatch, getState) {
    var userAttributes = getUserAttributes(getState());
    var tourUserAttributeKey = SHEPHERD_TOURS_USER_ATTRIBUTES[tourId];
    var tourStepsSeen = JSON.parse(userAttributes.get(tourUserAttributeKey)); // The 'tourSkipped' key doesn't need to be defined in the list of steps for a
    // tour, but we still want to store it when the tour is actually skipped.

    var tourStepId = SHEPHERD_TOURS_STEPS[tourId].get(stepId);

    if (!tourStepId && stepId === 'tourSkipped') {
      tourStepId = 'tourSkipped';
    }

    if (tourStepsSeen[tourStepId]) {
      return;
    }

    dispatch(saveUserAttribute({
      key: tourUserAttributeKey,
      value: JSON.stringify(Object.assign({}, tourStepsSeen, _defineProperty({}, tourStepId, new Date().valueOf()))),
      callback: callback
    }));
  };
};
export var dismissTour = function dismissTour(tourId) {
  return function (dispatch) {
    dispatch(dismissTourStep(tourId, 'tourSkipped'));
  };
};
export var onChangeFavorite = function onChangeFavorite(isFavorite, channelKey, network) {
  return function (dispatch, getState) {
    var favoriteChannelsKeys = getFavoriteChannelKeys(getState());

    if (isFavorite) {
      dispatch(saveUserAttribute({
        key: USER_ATTR_FAVORITE_CHANNEL_KEYS,
        value: JSON.stringify(smartAdd(favoriteChannelsKeys, channelKey))
      }));
    } else {
      dispatch(saveUserAttribute({
        key: USER_ATTR_FAVORITE_CHANNEL_KEYS,
        value: JSON.stringify(smartDelete(favoriteChannelsKeys, channelKey))
      }));
    }

    trackInteraction(isFavorite ? 'favorite channel' : 'unfavorite channel', {
      network: network
    });
  };
};
export var replaceFavoriteChannels = createAction(actionTypes.USER_ATTR_FAV_CHANNEL_REPLACE_FOR_NETWORK, function (network, keys) {
  return {
    network: network,
    keys: keys
  };
});