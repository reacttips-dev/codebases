'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _STATUS_TYPE_TO_COUNT, _handleActions;

import { handleActions } from 'flux-actions';
import { Set as ImmutableSet } from 'immutable';
import { pick } from 'underscore';
import I18n from 'I18n';
import ActionMapper from '../../lib/legacyRequestActionMapper';
import PortalStorage from '../../lib/storage';
import DataFilter from '../../data/model/DataFilter';
import { BROADCAST_STATUS_TYPE, FEED_INTERACTION_TYPES } from '../../lib/constants';
import actionTypes from '../actions/actionTypes';
import { parse } from 'hub-http/helpers/params';
var portalStorage = PortalStorage.getInstance();
var queryParams = parse(window.location.search.substring(1));
var initialDataFilter = DataFilter.createFromQueryParams(queryParams);

if (Array.isArray(portalStorage.get().excludedChannelKeys)) {
  initialDataFilter = initialDataFilter.set('excludedChannelKeys', ImmutableSet(portalStorage.get().excludedChannelKeys));
}

if (portalStorage.get().channelKeysUpdatedAt) {
  initialDataFilter = initialDataFilter.set('channelsCachedAt', portalStorage.get().channelKeysUpdatedAt);
}

var STATUS_TYPE_TO_COUNT_ATTR = (_STATUS_TYPE_TO_COUNT = {}, _defineProperty(_STATUS_TYPE_TO_COUNT, BROADCAST_STATUS_TYPE.published, 'SUCCESS'), _defineProperty(_STATUS_TYPE_TO_COUNT, BROADCAST_STATUS_TYPE.scheduled, 'SCHEDULED'), _defineProperty(_STATUS_TYPE_TO_COUNT, BROADCAST_STATUS_TYPE.draft, 'DRAFT'), _defineProperty(_STATUS_TYPE_TO_COUNT, BROADCAST_STATUS_TYPE.failed, 'FAILED'), _STATUS_TYPE_TO_COUNT);
export default handleActions((_handleActions = {}, _defineProperty(_handleActions, actionTypes.DATAFILTER_UPDATE, function (state, action) {
  state = state.merge(action.payload);

  if (action.payload.excludedChannelKeys) {
    var excludedChannelKeys = action.payload.excludedChannelKeys.toArray();
    portalStorage.set({
      excludedChannelKeys: excludedChannelKeys,
      filtered: excludedChannelKeys.length > 0
    });
  }

  return state;
}), _defineProperty(_handleActions, actionTypes.INBOX_UPDATE, function (state, action) {
  // since non-twitter accounts could be selected
  if (action.payload.interactionType === FEED_INTERACTION_TYPES.FOLLOWERS) {
    return state.delete('excludedChannelKeys');
  }

  return state;
}), _defineProperty(_handleActions, ActionMapper.began(actionTypes.BROADCASTS_FETCH), function (state) {
  return state.set('broadcastsLastRequested', I18n.moment().valueOf());
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.BROADCASTS_FETCH), function (state, action) {
  state = state.merge(pick(action.data, 'total', 'broadcastStatusType')); // seen weird edge cases where we get locked out of pagination in this case

  if (action.data.broadcasts.isEmpty() && state.page > 1) {
    state = state.set('page', 1);
  }

  return state;
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.BROADCAST_COUNT_FETCH), function (state, action) {
  if (action.data && typeof action.data.shouldPoll === 'boolean') {
    state = state.set('shouldPollBroadcasts', action.data.shouldPoll);
  } // possible as we are quickFetching initial page and broadcasts without total count, and moving to /v2/broadcasts/counts-with-published for count
  // for all statusType sections. still need to figure out how we approach filters as this endpoint is not sensitive to them other than date range (but we only ask for 30 day counts and do not quickFetch when there is a non-default date range in query params)


  if (!state.total) {
    // makes the publishing table pagination work without knowing a total from the initial quickFetch of broadcasts
    var countValue = action.data.counts[STATUS_TYPE_TO_COUNT_ATTR[state.broadcastStatusType]];

    if (countValue) {
      state = state.set('total', countValue);
    }
  }

  return state;
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.ACCOUNTS_WITH_CHANNELS_FETCH), function (state, action) {
  state = state.set('allChannelKeys', action.data.readableChannelKeys);
  portalStorage.set({
    allChannelKeys: action.data.readableChannelKeys,
    channelKeysUpdatedAt: I18n.moment().valueOf()
  });
  return state;
}), _handleActions), initialDataFilter);