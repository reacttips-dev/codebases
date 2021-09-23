'use es6';

import DefaultViewStore from 'crm_data/views/DefaultViewStore';
import { ResultRecord } from '../../utils/ResultRecord';
export var defaultViewDep = {
  stores: [DefaultViewStore],
  deref: function deref(_ref) {
    var objectTypeId = _ref.objectTypeId;
    var data = DefaultViewStore.get(objectTypeId);
    return ResultRecord.from({
      data: data
    });
  }
};