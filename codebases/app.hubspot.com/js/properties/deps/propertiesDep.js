'use es6';

import PropertiesStore from 'crm_data/properties/PropertiesStore';
import PropertyGroupsStore from 'crm_data/properties/PropertyGroupsStore';
import { ResultRecord } from '../../utils/ResultRecord';
export var propertiesDep = {
  stores: [PropertiesStore, PropertyGroupsStore],
  deref: function deref(_ref) {
    var objectTypeId = _ref.objectTypeId;
    var data = PropertiesStore.get(objectTypeId);
    return ResultRecord.from({
      data: data
    });
  }
};