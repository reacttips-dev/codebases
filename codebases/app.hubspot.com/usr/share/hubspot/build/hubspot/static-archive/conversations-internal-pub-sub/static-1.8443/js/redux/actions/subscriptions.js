'use es6';

import { UPDATE_SUBSCRIPTIONS, RESUBSCRIBE } from '../constants/actionTypes';
import { DEFAULT_CLIENT_KEY } from '../constants/clientKeys';
import { getPubSubClient } from '../selectors/pubSubClientGetters';
import { silenceErrorAlert } from 'conversations-error-reporting/error-actions/builders/silenceErrorAlert';

var updateSubscriptionsStarted = function updateSubscriptionsStarted(subscriptions) {
  var clientKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_CLIENT_KEY;
  return {
    type: UPDATE_SUBSCRIPTIONS.STARTED,
    payload: {
      clientKey: clientKey,
      subscriptions: subscriptions
    }
  };
};

var updateSubscriptionsSucceeded = function updateSubscriptionsSucceeded(subscriptions) {
  var clientKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_CLIENT_KEY;
  return {
    type: UPDATE_SUBSCRIPTIONS.SUCCEEDED,
    payload: {
      clientKey: clientKey,
      subscriptions: subscriptions
    }
  };
};

var updateSubscriptionsFailed = function updateSubscriptionsFailed(error) {
  var clientKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_CLIENT_KEY;
  return {
    type: UPDATE_SUBSCRIPTIONS.FAILED,
    payload: {
      clientKey: clientKey,
      error: error
    },
    meta: silenceErrorAlert()
  };
};

export var resubscribe = function resubscribe(clientKey) {
  return {
    type: RESUBSCRIBE,
    payload: {
      clientKey: clientKey
    }
  };
};
/**
 * @typedef subscriptionObject
 * @type {Object}
 * @property {function} onMessage - Called when a message is received
 * @property {function} [onPlayback] - Optional callback to received messages that are played back

/**
 * Update the current subscriptions.
 *
 * @param {Object<string, subscriptionObject>} subscriptions - A mapping of channel and subscription
 */

export var updateSubscriptions = function updateSubscriptions(subscriptions) {
  var clientKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_CLIENT_KEY;
  return function (dispatch, getState) {
    var client = getPubSubClient(getState(), {
      clientKey: clientKey
    });
    dispatch(updateSubscriptionsStarted(subscriptions, clientKey));
    client.updateSubscriptions(subscriptions).then(function (result) {
      if (result === client.updateSubscriptions.DEBOUNCED) {
        // An out of date subscription update was skipped in favor of a more recent update.
        return;
      }

      dispatch(updateSubscriptionsSucceeded(result, clientKey));
    }, function (error) {
      dispatch(updateSubscriptionsFailed(error, clientKey));
    }).done();
  };
};