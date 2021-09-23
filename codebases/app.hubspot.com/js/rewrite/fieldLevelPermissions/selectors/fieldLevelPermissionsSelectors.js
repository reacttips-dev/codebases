'use es6';

import getIn from 'transmute/getIn';
import { createSelector } from 'reselect';
import { getCurrentObjectTypeId } from '../../init/selectors/routerStateSelectors';
import { NOT_SPECIFIED } from '../constants/FieldLevelPermissionTypes';

var getFieldLevelPermissionsSlice = function getFieldLevelPermissionsSlice(state) {
  return state.fieldLevelPermissions;
};

export var getPermissionsForCurrentObjectType = createSelector([getFieldLevelPermissionsSlice, getCurrentObjectTypeId], function (slice, objectTypeId) {
  return slice[objectTypeId] || {};
});
export var getGetPropertyPermission = createSelector([getPermissionsForCurrentObjectType], function (permissions) {
  return function (propertyName) {
    return getIn([propertyName, 'accessLevel'], permissions) || NOT_SPECIFIED;
  };
});