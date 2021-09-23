'use es6';

import CrmRecordCardViewsStore from './CrmRecordCardViewsStore';
import { ObjectTypesToIds } from 'customer-data-objects/constants/ObjectTypeIds';
import { VIEW_LOCATION_OBJECT_BOARD } from './CrmRecordCardConstants';
export var crmRecordCardViewsDep = {
  stores: [CrmRecordCardViewsStore],
  deref: function deref(_ref) {
    var objectType = _ref.objectType;
    var objectTypeId = ObjectTypesToIds[objectType] || objectType;
    return CrmRecordCardViewsStore.get({
      objectTypeId: objectTypeId,
      location: VIEW_LOCATION_OBJECT_BOARD
    });
  }
};