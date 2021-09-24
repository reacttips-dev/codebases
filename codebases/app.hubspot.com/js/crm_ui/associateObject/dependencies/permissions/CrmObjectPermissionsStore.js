'use es6';

import dispatcher from 'dispatcher/dispatcher';
import { defineLazyKeyStore, registerLazyKeyService } from 'crm_data/store/LazyKeyStore';
import { Map as ImmutableMap } from 'immutable';
import { fetchPermissionsForCrmObjects } from './CrmObjectPermissionsAPI';
import { isObjectTypeId } from 'customer-data-objects/constants/ObjectTypeIds';
var CRM_OBJECT_PERMISSIONS = 'CRM_OBJECT_PERMISSIONS';
registerLazyKeyService({
  namespace: CRM_OBJECT_PERMISSIONS,
  fetch: fetchPermissionsForCrmObjects
});
export default defineLazyKeyStore({
  namespace: CRM_OBJECT_PERMISSIONS,
  idIsValid: function idIsValid() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        objectType = _ref.objectType,
        objectId = _ref.objectId;

    return typeof objectId === 'number' && isObjectTypeId(objectType);
  },
  idTransform: ImmutableMap
}).defineName('CrmObjectPermissionsStore').register(dispatcher);