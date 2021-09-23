'use es6';

import memoize from 'transmute/memoize';
import PropTypes from 'prop-types';
import IsUngatedStore from '../gates/IsUngatedStore';
import FieldLevelPermissionsStore from 'crm_data/properties/FieldLevelPermissionsStore';
import { FLP_REST_TO_GQL_CONSTANT_MAPPING, NOT_SPECIFIED } from './FieldLevelPermissionTypes';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
export var emptyPermissionCheck = function emptyPermissionCheck() {
  return NOT_SPECIFIED;
};
export var checkHasFieldLevelPermissionsAccess = function checkHasFieldLevelPermissionsAccess(scopes) {
  return scopes.includes('field-level-permissions-access');
};
export var mapRestToGQLPermissionConstants = function mapRestToGQLPermissionConstants(name) {
  return FLP_REST_TO_GQL_CONSTANT_MAPPING[name] || NOT_SPECIFIED;
}; // getPropertyPermission

export var buildGetPropertyPermission = memoize(function (permissionsForType) {
  return function (name) {
    return mapRestToGQLPermissionConstants(permissionsForType.get(name));
  };
});
export var buildGetPropertyPermissionFromObjectTypeAndScopes = function buildGetPropertyPermissionFromObjectTypeAndScopes(_ref) {
  var objectType = _ref.objectType,
      scopes = _ref.scopes;
  var enforcePermissions = checkHasFieldLevelPermissionsAccess(scopes);

  if (!enforcePermissions) {
    return emptyPermissionCheck;
  }

  var permissionsForType = FieldLevelPermissionsStore.get(objectType);
  /*
   * This explicitly allows users to do whatever they want if the FLP fetch fails.
   * In failure cases like this we'll rely on the BE to reject unauthorized requests.
   */

  if (!permissionsForType) {
    return emptyPermissionCheck;
  }

  return buildGetPropertyPermission(permissionsForType);
}; // Dependencies

export var fetchFLPDependency = {
  propTypes: {
    objectType: AnyCrmObjectTypePropType.isRequired,
    scopes: PropTypes.array.isRequired
  },
  stores: [FieldLevelPermissionsStore],
  deref: function deref(_ref2) {
    var objectType = _ref2.objectType,
        scopes = _ref2.scopes;

    if (!checkHasFieldLevelPermissionsAccess(scopes)) {
      return true;
    }

    return FieldLevelPermissionsStore.get(objectType);
  }
};
export var getPropertyPermissionDependency = {
  propTypes: {
    objectType: AnyCrmObjectTypePropType.isRequired,
    scopes: PropTypes.array.isRequired
  },
  stores: [FieldLevelPermissionsStore, IsUngatedStore],
  deref: function deref(_ref3) {
    var objectType = _ref3.objectType,
        scopes = _ref3.scopes;
    return buildGetPropertyPermissionFromObjectTypeAndScopes({
      objectType: objectType,
      scopes: scopes
    });
  }
};