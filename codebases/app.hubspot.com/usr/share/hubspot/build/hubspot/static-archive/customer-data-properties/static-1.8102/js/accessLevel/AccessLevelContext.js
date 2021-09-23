'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import React, { useCallback, useContext, useMemo, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import memoize from 'transmute/memoize';
import { isObjectTypeId, ObjectTypesToIds } from 'customer-data-objects/constants/ObjectTypeIds';
import { NOT_SPECIFIED_REST } from '../constants/FieldLevelPermissionTypes';
import { fetchAccessLevel } from './api';
var FETCH_STATUS = {
  UNINITIALIZED: 'UNINITIALIZED',
  PENDING: 'PENDING',
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED'
};
var DEFAULT_CONTEXT = {
  isActive: false,
  fetchStatusesRef: {
    current: {}
  },
  accessLevelsByObjectTypeId: {},
  setFetchStatus: function setFetchStatus() {},
  setAccessLevels: function setAccessLevels() {}
};
export var AccessLevelContext = /*#__PURE__*/React.createContext(DEFAULT_CONTEXT);
var mapToObjectTypeId = memoize(function (objectType) {
  return isObjectTypeId(objectType) ? objectType : ObjectTypesToIds[objectType];
});

var getFetchStatus = function getFetchStatus(context, objectTypeId) {
  return context.fetchStatusesRef.current[objectTypeId] || FETCH_STATUS.UNINITIALIZED;
};

export var AccessLevelContextProvider = function AccessLevelContextProvider(_ref) {
  var _ref$active = _ref.active,
      active = _ref$active === void 0 ? true : _ref$active,
      children = _ref.children;
  var fetchStatusesRef = useRef({});

  var _useReducer = useReducer(function (state, _ref2) {
    var objectTypeId = _ref2.objectTypeId,
        accessLevels = _ref2.accessLevels;
    return Object.assign({}, state, _defineProperty({}, objectTypeId, accessLevels));
  }, {}),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      accessLevelsByObjectTypeId = _useReducer2[0],
      setAccessLevels = _useReducer2[1];

  var setFetchStatus = useCallback(function (_ref3) {
    var objectTypeId = _ref3.objectTypeId,
        fetchStatus = _ref3.fetchStatus;
    fetchStatusesRef.current = Object.assign({}, fetchStatusesRef.current, _defineProperty({}, objectTypeId, fetchStatus));
  }, []); // Memoized to prevent unnecessary re-renders, see https://reactjs.org/docs/context.html#caveats

  var context = useMemo(function () {
    return {
      isActive: active,
      fetchStatusesRef: fetchStatusesRef,
      accessLevelsByObjectTypeId: accessLevelsByObjectTypeId,
      setFetchStatus: setFetchStatus,
      setAccessLevels: setAccessLevels
    };
  }, [active, fetchStatusesRef, accessLevelsByObjectTypeId, setFetchStatus, setAccessLevels]);
  return /*#__PURE__*/_jsx(AccessLevelContext.Provider, {
    value: context,
    children: children
  });
};
AccessLevelContextProvider.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node
};
export var getAccessLevelWithCaching = function getAccessLevelWithCaching(_ref4) {
  var context = _ref4.context,
      objectType = _ref4.objectType,
      propertyName = _ref4.propertyName;
  var isActive = context.isActive,
      accessLevelsByObjectTypeId = context.accessLevelsByObjectTypeId,
      setFetchStatus = context.setFetchStatus,
      setAccessLevels = context.setAccessLevels;

  if (!isActive) {
    return null;
  }

  var objectTypeId = mapToObjectTypeId(objectType);

  if (!objectTypeId || !propertyName) {
    return null;
  } // If we don't have the access level permissions in context, fetch them


  if (getFetchStatus(context, objectTypeId) === FETCH_STATUS.UNINITIALIZED) {
    setFetchStatus({
      objectTypeId: objectTypeId,
      fetchStatus: FETCH_STATUS.PENDING
    });
    fetchAccessLevel(objectTypeId).then(function (accessLevels) {
      setFetchStatus({
        objectTypeId: objectTypeId,
        fetchStatus: FETCH_STATUS.SUCCEEDED
      });
      setAccessLevels({
        objectTypeId: objectTypeId,
        accessLevels: accessLevels
      });
    }).catch(function () {
      setFetchStatus({
        objectTypeId: objectTypeId,
        fetchStatus: FETCH_STATUS.FAILED
      });
    });
  }

  var fetchStatus = getFetchStatus(context, objectTypeId);
  var accessLevels = accessLevelsByObjectTypeId[objectTypeId];

  if (fetchStatus !== FETCH_STATUS.SUCCEEDED || !accessLevels) {
    return null;
  }

  return accessLevels[propertyName] || NOT_SPECIFIED_REST;
};
export var useAccessLevel = function useAccessLevel(_ref5) {
  var objectType = _ref5.objectType,
      propertyName = _ref5.propertyName,
      accessLevelOverride = _ref5.accessLevelOverride;
  var context = useContext(AccessLevelContext);

  if (accessLevelOverride !== undefined) {
    return accessLevelOverride;
  }

  return getAccessLevelWithCaching({
    context: context,
    objectType: objectType,
    propertyName: propertyName
  });
};