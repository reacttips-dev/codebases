'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions;

import actionTypes from '../actions/actionTypes';
import { List } from 'immutable';
import { handleActions } from 'flux-actions';
import PortalStorage from '../../lib/storage';
var storage = PortalStorage.getInstance();
export var bannerMessages = handleActions((_handleActions = {}, _defineProperty(_handleActions, actionTypes.DISMISS_BANNER, function (state, action) {
  var dismissedMessages = List();

  if (storage.get().dismissedMessages) {
    dismissedMessages = List(storage.get().dismissedMessages);
  }

  dismissedMessages = dismissedMessages.push(action.payload);
  storage.set({
    dismissedMessages: dismissedMessages
  });
  return dismissedMessages;
}), _defineProperty(_handleActions, actionTypes.UPDATE_DISMISSED_BANNERS, function () {
  return storage.get().dismissedMessages;
}), _handleActions), List());