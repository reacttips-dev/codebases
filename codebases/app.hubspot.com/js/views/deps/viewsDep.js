'use es6';

import ViewsStore from '../../crm_ui/flux/views/ViewsStore';
import { ResultRecord } from '../../utils/ResultRecord';
export var viewsDep = {
  stores: [ViewsStore],
  deref: function deref(_ref) {
    var objectTypeId = _ref.objectTypeId,
        viewId = _ref.viewId;
    var status = ViewsStore.get({
      objectType: objectTypeId
    });
    var viewKey = ViewsStore.getViewKey({
      objectType: objectTypeId,
      viewId: viewId
    });
    var data = ViewsStore.get(viewKey);
    return ResultRecord.from({
      status: status,
      data: data
    });
  }
};