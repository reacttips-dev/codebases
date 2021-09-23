'use es6';

import { defineFactory } from 'general-store';
import dispatcher from 'dispatcher/dispatcher';
import { Map as ImmutableMap, List } from 'immutable';
import { VIEW_DELETED } from 'crm_data/actions/ActionTypes';
import { fetchPinnedViews } from '../actions/PinnedViewsActions';
import { PINNED_VIEWS_FETCH_SUCCEEDED, PINNED_VIEWS_USER_UPDATE_SUCCEEDED } from '../actions/PinnedViewsActionTypes';
import { UNINITIALIZED, STARTED, SUCCEEDED } from '../../utils/FetchStatus';
import { normalizeTypeId } from '../../utils/normalizeTypeId'; // We can't let this be part of state because (unlike redux) we can't
// ensure that a dispatched action has completed before we process the next .get,
// which means we would start double-fetching.

var fetchStatus = ImmutableMap();
export default defineFactory().defineName('PinnedViewsStore').defineGetInitialState(function () {
  return ImmutableMap();
}).defineGet(function (state, objectTypeId) {
  var parsedTypeId = normalizeTypeId(objectTypeId);

  if (parsedTypeId && fetchStatus.get(parsedTypeId, UNINITIALIZED) === UNINITIALIZED) {
    fetchStatus = fetchStatus.set(parsedTypeId, STARTED);
    fetchPinnedViews(parsedTypeId);
  }

  return parsedTypeId ? state.get(parsedTypeId) : state;
}).defineResponseTo(PINNED_VIEWS_FETCH_SUCCEEDED, function (state, _ref) {
  var objectTypeId = _ref.objectTypeId,
      pinnedViewIds = _ref.pinnedViewIds;
  fetchStatus = fetchStatus.set(objectTypeId, SUCCEEDED);
  return state.set(objectTypeId, List(pinnedViewIds));
}).defineResponseTo(PINNED_VIEWS_USER_UPDATE_SUCCEEDED, function (state, _ref2) {
  var viewIds = _ref2.viewIds,
      objectTypeId = _ref2.objectTypeId;
  var parsedTypeId = normalizeTypeId(objectTypeId);
  return state.set(parsedTypeId, List(viewIds));
}).defineResponseTo(VIEW_DELETED, function (state, _ref3) {
  var objectType = _ref3.objectType,
      viewId = _ref3.viewId;
  var parsedTypeId = normalizeTypeId(objectType);
  return state.update(parsedTypeId, function () {
    var pinnedViews = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
    return pinnedViews.filter(function (id) {
      return String(id) !== String(viewId);
    });
  });
}).register(dispatcher);