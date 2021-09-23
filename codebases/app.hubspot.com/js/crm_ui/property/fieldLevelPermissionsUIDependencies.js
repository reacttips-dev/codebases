'use es6';

import IsUngatedStore from 'crm_data/gates/IsUngatedStore';
import ScopesContainer from '../../containers/ScopesContainer';
import FieldLevelPermissionsStore from 'crm_data/properties/FieldLevelPermissionsStore';
import { NOT_SPECIFIED } from 'crm_data/properties/FieldLevelPermissionTypes';
import { getPipelineProperty } from '../pipelines/getPipelineProperty';
import { getStageProperty } from '../pipelines/getStageProperty';
import { buildGetPropertyPermissionFromObjectTypeAndScopes, fetchFLPDependency } from 'crm_data/properties/FieldLevelPermissionsDependencies';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes'; // Most of the logic in this file has been moved to pass through the crm_data versions

export var isEditable = function isEditable(permission) {
  return permission === NOT_SPECIFIED;
};
export var getCanEditPropertyAndDependents = function getCanEditPropertyAndDependents(_ref) {
  var objectType = _ref.objectType,
      propertyName = _ref.propertyName,
      getPropertyPermission = _ref.getPropertyPermission;
  var stageProperty = getStageProperty(objectType);
  var isPipeline = getPipelineProperty(objectType) === propertyName;
  var canEdit = isEditable(getPropertyPermission(propertyName));

  if (isPipeline) {
    return canEdit && isEditable(getPropertyPermission(stageProperty));
  }

  return canEdit;
}; // Dependencies

export var buildGetPropertyPermissionFromObjectType = function buildGetPropertyPermissionFromObjectType(_ref2) {
  var objectType = _ref2.objectType;
  return buildGetPropertyPermissionFromObjectTypeAndScopes({
    objectType: objectType,
    scopes: Object.keys(ScopesContainer.get())
  });
};
export var getPropertyPermissionDependency = {
  propTypes: {
    objectType: AnyCrmObjectTypePropType.isRequired
  },
  stores: [FieldLevelPermissionsStore, IsUngatedStore],
  deref: function deref(_ref3) {
    var objectType = _ref3.objectType;
    return buildGetPropertyPermissionFromObjectType({
      objectType: objectType
    });
  }
};
export var fetchFieldLevelPermissionsDependency = {
  propTypes: {
    objectType: AnyCrmObjectTypePropType.isRequired
  },
  stores: fetchFLPDependency.stores,
  deref: function deref(_ref4) {
    var objectType = _ref4.objectType;
    return fetchFLPDependency.deref({
      objectType: objectType,
      scopes: Object.keys(ScopesContainer.get())
    });
  }
};