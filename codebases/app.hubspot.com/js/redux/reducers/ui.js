'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions;

import { handleActions } from 'flux-actions';
import ActionMapper from '../../lib/legacyRequestActionMapper';
import { List, Map as ImmutableMap, fromJS } from 'immutable';
import actionTypes from '../actions/actionTypes';
import { NAV_ITEMS, COMPOSER_MODES, APP_SECTIONS } from '../../lib/constants';
import { logError } from '../../lib/utils';
var DEFAULTS = ImmutableMap({
  isSpaceSword: true,
  exportModalIsOpen: false,
  bulkScheduleModalIsOpen: false,
  bulkScheduleButtonEnabled: false,
  bulkActionDialogIsOpen: false,
  bulkActionType: null,
  composerOpen: false,
  composerSuccessOpen: false,
  linkShorteningDomains: List(),
  monitoringWelcomeOpen: null,
  // intentionally null, false means closed on purpose
  publishingWelcomeOpen: null,
  // same as above
  navItems: fromJS(NAV_ITEMS),
  connectStep: null,
  connectingAccountGuid: null,
  connectingNetwork: null,
  accountConnectFailure: null,
  editingBapForChannel: null,
  isPollingUploaded: false,
  isBulkActionLoading: false,
  boostingBroadcastGuid: null
});
var MAX_BULK_UPLOAD_POLLS = 20;
export default handleActions((_handleActions = {}, _defineProperty(_handleActions, ActionMapper.success(actionTypes.BLOG_AUTO_PUBLISH_SAVE), function (state) {
  return state.set('editingBapForChannel', null);
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.BULK_UPLOAD_STATUS_CHANGE), function (state) {
  return state.merge({
    bulkActionDialogIsOpen: false,
    isBulkActionLoading: false
  });
}), _defineProperty(_handleActions, actionTypes.SET_VISIBLE_SHEPHERD_POPOVER, function (state, action) {
  return state.set('visibleShepherdPopover', action.payload);
}), _defineProperty(_handleActions, actionTypes.UI_UPDATE, function (state, action) {
  return state.merge(action.payload);
}), _defineProperty(_handleActions, actionTypes.SET_CONNECT_STEP, function (state, action) {
  return state.set('connectStep', action.payload);
}), _defineProperty(_handleActions, actionTypes.SET_CONNECTING_ACCOUNT_GUID, function (state, action) {
  return state.set('connectingAccountGuid', action.payload);
}), _defineProperty(_handleActions, actionTypes.SET_CONNECTING_NETWORK, function (state, action) {
  return state.set('connectingNetwork', action.payload);
}), _defineProperty(_handleActions, actionTypes.BROADCAST_GROUP_INIT, function (state) {
  return state.merge({
    composerMode: COMPOSER_MODES.create,
    composerOpen: true,
    composerHasSaved: false
  });
}), _defineProperty(_handleActions, actionTypes.BROADCAST_GROUP_POPULATE, function (state, action) {
  var hasExistingMessages = action.payload.messages.find(function (m) {
    return m.broadcastGuids && !m.broadcastGuids.isEmpty();
  });
  return state.merge({
    composerMode: !hasExistingMessages || hasExistingMessages.isEmpty() ? COMPOSER_MODES.create : COMPOSER_MODES.edit,
    composerOpen: true,
    composerHasSaved: false
  });
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.BROADCAST_EDIT), function (state) {
  return state.merge({
    composerMode: COMPOSER_MODES.edit,
    composerOpen: true,
    composerHasSaved: false
  });
}), _defineProperty(_handleActions, actionTypes.BROADCAST_GROUP_CLONE, function (state) {
  return state.merge({
    composerMode: COMPOSER_MODES.create,
    composerOpen: true,
    composerHasSaved: false
  });
}), _defineProperty(_handleActions, actionTypes.BROADCAST_GROUP_APPROVE_INIT, function (state) {
  return state.merge({
    composerMode: COMPOSER_MODES.approve,
    composerOpen: true,
    composerHasSaved: false
  });
}), _defineProperty(_handleActions, actionTypes.SET_ROUTE, function (state, action) {
  var route = action.payload.routes[action.payload.routes.length - 1];

  if (state.get('monitoringWelcomeOpen') && ![APP_SECTIONS.inbox, APP_SECTIONS.monitoring].includes(route.appSection)) {
    return state.set('monitoringWelcomeOpen', false);
  } else if (state.get('publishingWelcomeOpen') && route.appSection !== APP_SECTIONS.publishing) {
    return state.set('publishingWelcomeOpen', false);
  }

  return state;
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.LINK_SHORTENING_DOMAINS_FETCH), function (state, action) {
  return state.set('linkShorteningDomains', action.data.get('possibleDomains').push('bit.ly'));
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.BULK_SCHEDULE_UPLOAD), function (state) {
  return state.set('bulkScheduleModalIsOpen', false);
}), _defineProperty(_handleActions, ActionMapper.error(actionTypes.BULK_UPLOAD_STATUS_CHANGE), function (state) {
  return state.set('isBulkActionLoading', false);
}), _defineProperty(_handleActions, ActionMapper.began(actionTypes.BULK_UPLOAD_STATUS_CHANGE), function (state) {
  return state.set('isBulkActionLoading', true);
}), _defineProperty(_handleActions, actionTypes.BROADCASTS_UPLOADED_POLL_BEGAN, function (state) {
  return state.merge({
    isPollingUploaded: true,
    uploadedPolls: 0
  });
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.BROADCAST_COUNT_FETCH), function (state) {
  if (state.get('isPollingUploaded')) {
    state = state.set('uploadedPolls', state.get('uploadedPolls') + 1);

    if (state.get('uploadedPolls') > MAX_BULK_UPLOAD_POLLS) {
      // circuit breaker for busy 1second polling during bulk upload processing
      state = state.set('isPollingUploaded', false);
      logError('Gave up polling for bulk upload completion');
    }
  }

  return state;
}), _defineProperty(_handleActions, actionTypes.BROADCASTS_UPLOADED_POLL_DONE, function (state) {
  return state.set('isPollingUploaded', false);
}), _handleActions), DEFAULTS);