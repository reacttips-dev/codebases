'use es6';

import CrmObjectTypeStore from 'crm_data/crmObjectTypes/CrmObjectTypeStore';
import { ResultRecord } from '../../utils/ResultRecord';
import get from 'transmute/get';
export var crmObjectDefinitionsDep = {
  stores: [CrmObjectTypeStore],
  deref: function deref() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        objectTypeId = _ref.objectTypeId;

    var objectTypes = CrmObjectTypeStore.get();
    var data = objectTypeId ? get(objectTypeId, objectTypes) : objectTypes;
    return ResultRecord.from({
      status: objectTypes,
      data: data
    });
  }
};