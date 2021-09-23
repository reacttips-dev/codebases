'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { PROPERTIES_FETCH_SUCCEEDED } from '../../properties/actions/propertiesActionTypes';
var initialState = {};
export var fieldLevelPermissionsReducer = function fieldLevelPermissionsReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case PROPERTIES_FETCH_SUCCEEDED:
      {
        var _action$payload = action.payload,
            properties = _action$payload.properties,
            objectTypeId = _action$payload.objectTypeId;
        return Object.assign({}, state, _defineProperty({}, objectTypeId, properties.filter(function (_ref) {
          var permission = _ref.permission;
          return permission;
        }).reduce(function (permissionMap, propertyData) {
          var permission = propertyData.permission,
              property = propertyData.property;
          permissionMap[property.name] = permission;
          return permissionMap;
        }, state[objectTypeId] || {})));
      }

    default:
      {
        return state;
      }
  }
};