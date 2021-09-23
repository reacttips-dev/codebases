'use es6';

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import I18n from 'I18n';
import { routerMiddleware } from 'react-router-redux';
import logger from '../middleware/logger';
import NotificationMiddleware from 'ReduxMessenger/middleware/NotificationMiddleware';
import createRavenMiddleware from '../middleware/raven';
import netMiddleware from '../middleware/legacyRequestNetMiddleware';
import { usageTrackerMiddleware } from 'usage-tracker-redux';
import root from './reducers/root';
import { getNotificationFor } from '../lib/utils';
import tracker from '../lib/usageTracker';
/*
Automatically pulls error or (rare) success messages that are defined in sui.notifications yaml block based on action name
Overall we want to move away from redux-network-utils style which this is highly coupled to, in favor of explicit error/success messaging in specific actions
This idea has proved brittle as actions are refactored and renamed.
 */

export var notificationFilterMiddleware = function notificationFilterMiddleware() {
  return function (next) {
    return function (action) {
      action.meta = action.meta || {};
      var messageContext = action.error ? action.error.messageContext : {};
      messageContext = Object.assign({}, action.meta, {}, messageContext);

      if (action.type.endsWith('_ERROR')) {
        var actionKey = action.error && action.error.messageCode ? action.error.messageCode : action.type.replace('_ERROR', '').toLowerCase();

        if (action.error && !action.error.handled && I18n.lookup("sui.notifications." + actionKey + ".message")) {
          action.meta.notification = getNotificationFor(actionKey, 'danger', messageContext);
        }
      } else if (action.type.endsWith('_SUCCESS')) {
        var _actionKey = action.type.replace('_SUCCESS', '').toLowerCase();

        if (I18n.lookup("sui.notifications." + _actionKey + ".success")) {
          action.meta.notification = getNotificationFor(_actionKey, 'success', messageContext);
        }
      }

      return next(action);
    };
  };
};
var composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export var createForTest = function createForTest(initialState) {
  return createStore(root, initialState, composeEnhancers(applyMiddleware(logger, thunk, netMiddleware({
    withLegacyPromiseResolve: true
  }))));
};
export var configureStore = function configureStore(history, initialState) {
  var reduxRouterMiddleware = routerMiddleware(history);
  var usageTracker = usageTrackerMiddleware(tracker);
  return createStore(root, initialState, composeEnhancers(applyMiddleware(thunk, reduxRouterMiddleware, netMiddleware({
    withLegacyPromiseResolve: true
  }), usageTracker, notificationFilterMiddleware, NotificationMiddleware, createRavenMiddleware({
    reportActionErrors: true
  }))));
};