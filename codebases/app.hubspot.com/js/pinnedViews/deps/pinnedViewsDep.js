'use es6';

import PinnedViewsStore from '../stores/PinnedViewsStore';
import { ResultRecord } from '../../utils/ResultRecord';
export var pinnedViewsDep = {
  stores: [PinnedViewsStore],
  deref: function deref(_ref) {
    var objectTypeId = _ref.objectTypeId;
    var data = PinnedViewsStore.get(objectTypeId);
    return ResultRecord.from({
      data: data
    });
  }
};