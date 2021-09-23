'use es6';

import * as ActionTypes from 'crm_data/actions/ActionTypes';
import { dispatchImmediate, dispatchQueue } from 'crm_data/dispatch/Dispatch';
export default {
  update: function update(objectType, searchQuery, results) {
    return dispatchImmediate(ActionTypes.ES_DATA_UPDATED, {
      objectType: objectType,
      searchQuery: searchQuery,
      results: results
    });
  },
  moveResult: function moveResult(objectType, fromSearchQuery, toSearchQuery, fromViewId, toViewId, id, toIndex) {
    id = parseInt(id, 10);
    return dispatchQueue(ActionTypes.ES_RESULT_MOVED, {
      objectType: objectType,
      fromSearchQuery: fromSearchQuery,
      toSearchQuery: toSearchQuery,
      fromViewId: fromViewId,
      toViewId: toViewId,
      id: id,
      toIndex: toIndex
    }).done();
  }
};