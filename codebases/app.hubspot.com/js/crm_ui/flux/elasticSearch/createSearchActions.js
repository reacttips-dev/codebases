'use es6';

import { dispatchQueue } from 'crm_data/dispatch/Dispatch';
export default function (actionTypes) {
  var MOVED = actionTypes.MOVED;
  return {
    moveResult: function moveResult(key, searchQuery, from, to, id, toIndex) {
      id = parseInt(id, 10);
      return dispatchQueue(MOVED, {
        key: key,
        searchQuery: searchQuery,
        from: from,
        to: to,
        id: id,
        toIndex: toIndex
      }).done();
    }
  };
}