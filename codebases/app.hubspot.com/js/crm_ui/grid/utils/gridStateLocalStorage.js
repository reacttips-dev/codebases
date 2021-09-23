'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import * as LocalSettings from 'crm_data/settings/LocalSettings';
import devLogger from 'react-utils/devLogger';
import toJS from 'transmute/toJS';
import isString from 'transmute/isString';
import { fromJS } from 'immutable';
import isEmpty from 'transmute/isEmpty';
import isNull from 'transmute/isNull';
import { ObjectTypesToIds } from 'customer-data-objects/constants/ObjectTypeIds';
var emptyResult = {}; // This was duplicated from normalizeTypeId.js in crm-index-ui as part of https://git.hubteam.com/HubSpot/CRM/pull/22295
// If you make changes here, please go make them there as well!

export var normalizeTypeId = function normalizeTypeId(objectType) {
  return ObjectTypesToIds[objectType] || objectType;
};
export var safeStringify = function safeStringify(value) {
  try {
    return JSON.stringify(value);
  } catch (err) {
    devLogger.warn({
      message: err.message,
      key: "gridStateLocalStorage::safeStringify"
    });
    return '';
  }
};
export var safeParse = function safeParse(value) {
  try {
    return isString(value) || value === null ? JSON.parse(value) : emptyResult;
  } catch (err) {
    devLogger.warn({
      message: err.message,
      key: "gridStateLocalStorage::safeParse"
    });
  }

  return emptyResult;
};
export var deleteGridState = function deleteGridState(_ref) {
  var objectType = _ref.objectType,
      viewId = _ref.viewId;
  var objectTypeId = normalizeTypeId(objectType);

  if (!objectTypeId || !viewId) {
    devLogger.warn({
      key: "gridStateLocalStorage::deleteGridState",
      message: "deleteGridState requires objectType and viewId"
    });
  } else {
    LocalSettings.deleteFrom(sessionStorage, objectTypeId + ":" + viewId + ":gridState");
  }
};
export var getGridState = function getGridState(_ref2) {
  var objectType = _ref2.objectType,
      viewId = _ref2.viewId;
  var objectTypeId = normalizeTypeId(objectType);

  if (!objectTypeId || !viewId) {
    devLogger.warn({
      key: "gridStateLocalStorage::getGridState",
      message: "getGridState requires objectType and viewId"
    });
  } else {
    var gridState = LocalSettings.getFrom(sessionStorage, objectTypeId + ":" + viewId + ":gridState");

    if (gridState) {
      return safeParse(gridState);
    }

    var legacyGridState = LocalSettings.getFrom(sessionStorage, objectType + ":" + viewId + ":gridState");
    return safeParse(legacyGridState);
  }

  return emptyResult;
};
export var updateGridState = function updateGridState(_ref3) {
  var objectType = _ref3.objectType,
      viewId = _ref3.viewId,
      key = _ref3.key,
      value = _ref3.value;
  var objectTypeId = normalizeTypeId(objectType);

  if (!objectTypeId || !viewId) {
    devLogger.warn({
      key: "gridStateLocalStorage::updateGridState",
      message: "updateGridState requires objectType and viewId"
    });
  } else {
    var oldGridState = getGridState({
      objectType: objectTypeId,
      viewId: viewId
    });
    var newValue = toJS(value);

    if (key === 'state') {
      newValue = Object.assign({}, oldGridState.state, {}, newValue);
    }

    var newGridState = key ? Object.assign({}, oldGridState, _defineProperty({}, key, newValue)) : oldGridState;
    LocalSettings.setFrom(sessionStorage, objectTypeId + ":" + viewId + ":gridState", safeStringify(newGridState));
  }
};
export var getUIState = function getUIState(objectType) {
  return getGridState({
    objectType: objectType,
    viewId: 'lastAccessedView'
  });
};
export var updateUIState = function updateUIState(_ref4) {
  var objectType = _ref4.objectType,
      key = _ref4.key,
      value = _ref4.value;
  updateGridState({
    objectType: objectType,
    viewId: 'lastAccessedView',
    key: key,
    value: value
  });
};

var getLastAccessedView = function getLastAccessedView(objectType) {
  return getGridState({
    objectType: objectType,
    viewId: 'lastAccessedView'
  });
};

export var setLastAccessedView = function setLastAccessedView(_ref5) {
  var objectType = _ref5.objectType,
      viewId = _ref5.viewId;
  updateGridState({
    objectType: objectType,
    viewId: 'lastAccessedView',
    key: 'viewId',
    value: viewId
  });
};
export var clearLastAccessedView = function clearLastAccessedView(objectType) {
  deleteGridState({
    objectType: objectType,
    viewId: 'lastAccessedView'
  });
};
export var setLastAccessedPage = function setLastAccessedPage(_ref6) {
  var objectType = _ref6.objectType,
      value = _ref6.value;
  updateGridState({
    objectType: objectType,
    viewId: 'lastAccessedView',
    key: 'lastPage',
    value: value
  });
};
export var getLastAccessedPage = function getLastAccessedPage(_ref7) {
  var objectType = _ref7.objectType,
      viewId = _ref7.viewId;

  var _getLastAccessedView = getLastAccessedView(objectType),
      lastPage = _getLastAccessedView.lastPage;

  if (lastPage && lastPage.viewId === viewId) {
    return lastPage;
  }

  return undefined;
};
export var deleteLastAccessedPage = function deleteLastAccessedPage(objectType) {
  updateGridState({
    objectType: objectType,
    viewId: 'lastAccessedView',
    key: 'lastPage',
    value: undefined
  });
};
export var reconcileWithCache = function reconcileWithCache(_ref8, view) {
  var objectType = _ref8.objectType,
      viewId = _ref8.viewId;
  var cache = getGridState({
    objectType: objectType,
    viewId: viewId
  });

  if (cache === emptyResult || isEmpty(cache)) {
    return view;
  }

  cache = fromJS(cache).filterNot(isNull);
  var combinedState = view.state.merge(cache.get('state'));
  return view.merge(cache).set('state', combinedState);
};